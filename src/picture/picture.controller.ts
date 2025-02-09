import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PictureService } from './picture.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';

@Controller('picture')
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  // solo admin :
  // crear imagenes de un car
  @Post('/crear_por_car/:idCar')
  create(@Param('idCar') idCar: number, @Body() createPictureDto: CreatePictureDto) {
    return this.pictureService.create(idCar,createPictureDto);
  }

  // Como admin quiero gestionar las imágenes:
  @Get('/car/:idCar')
  findOne(@Param('idCar') idCar: number) {
    return this.pictureService.findPicturesPorCar(idCar);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pictureService.remove(+id);
  }
}
