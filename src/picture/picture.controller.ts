import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PictureService } from './picture.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';

@Controller('picture')
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  @Post('/crear_por_car/:idCar')
  create(@Param('idCar') idCar: number, @Body() createPictureDto: CreatePictureDto) {
    return this.pictureService.create(idCar,createPictureDto);
  }

  @Get()
  findAll() {
    return this.pictureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pictureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePictureDto: UpdatePictureDto) {
    return this.pictureService.update(+id, updatePictureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pictureService.remove(+id);
  }
}
