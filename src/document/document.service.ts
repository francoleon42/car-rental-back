import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { User } from '../user/entities/user.entity';
import { Document } from './entities/document.entity';
import { Column, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rent } from '../rent/entities/rent.entity';
import { CarService } from '../car/car.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {
  }

  async create(user: User, createDocumentDto: CreateDocumentDto) {
    const document = new Document();
    document.url = createDocumentDto.url;
    document.src = createDocumentDto.src;
    document.description = createDocumentDto.description;
    document.title = createDocumentDto.title;
    document.createdAt = new Date();
    document.updatedAt = new Date();
    document.user = user;

    await this.documentRepository.save(document);
    return {
      url: document.url,
      src: document.src,
      description: document.description,
      title: document.title,
      createdAt: document.createdAt,
    };
  }

  findAll() {
    return `This action returns all document`;
  }

  findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
