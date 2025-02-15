import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { User } from '../user/entities/user.entity';
import { Document } from './entities/document.entity';
import { Column, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rent } from '../rent/entities/rent.entity';
import { CarService } from '../car/car.service';
import { S3Service } from '../s3/s3.service';
import { plainToInstance } from 'class-transformer';
import { DocumentRepository } from './document.repository';
import { ResponseDocumentDTO } from './dto/response-document.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentRepository)
    private readonly documentRepository: DocumentRepository,
    private s3Service: S3Service,
  ) {
  }

  async uploadFile(file: Express.Multer.File, createDocumentDto: CreateDocumentDto, user: User) {
    const fileResponse = await this.s3Service.uploadFile(file);
    const document = this.documentRepository.create({
      url: fileResponse.fileUrl,
      src: fileResponse.src,
      description: createDocumentDto.description,
      title: createDocumentDto.title,
      createdAt: new Date(),
      updatedAt: new Date(),
      user,
    });


    await this.documentRepository.save(document);
    return {
      url: document.url,
      src: document.src,
      description: document.description,
      title: document.title,
      createdAt: document.createdAt,
    };
  }


  async getUserDocuments(user: User) {
    const documents: Document[] = await this.documentRepository.findByUserId(user.id);
    if (!documents.length) {
      throw new NotFoundException('No requested rentals found.');
    }
    return documents.map(document =>
      plainToInstance(ResponseDocumentDTO, document, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    );
  }


}
