import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService,
              @InjectRepository(User)
              private readonly userRepository: Repository<User>) {
  }


  // EL usuario podra cargar documentos
  @Post('/crear')
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    //TODO : modificar con obtener el usuario logueado
    const id = 1;
    const user = await await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return this.documentService.create(user,createDocumentDto);
  }

  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(+id);
  }
}
