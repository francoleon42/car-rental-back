import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService,
              @InjectRepository(User)
              private readonly userRepository: Repository<User>) {
  }


  // USUARIO(admin y cliente)
  @Post('/crear')
  @Roles('client', 'admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async create(@Body() createDocumentDto: CreateDocumentDto, @UserDecorator() user: User) {
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return this.documentService.create(user,createDocumentDto);
  }

}
