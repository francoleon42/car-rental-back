import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from '../common/decorators/user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/decorators/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3/s3.service';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) {
  }


  @Post('/upload')
  @Roles('client', 'admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File,@Body() createDocumentDto: CreateDocumentDto, @UserDecorator() user: User) {
    if (!user) {
      throw new Error('User not found');
    }
    if (!file) {
      throw new Error('No file uploaded');
    }

    return this.documentService.uploadFile(file,createDocumentDto,user);
  }

  @Get('')
  @Roles('client', 'admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getFiles(@UserDecorator() user: User) {
    return this.documentService.getUserDocuments(user);
  }



}
