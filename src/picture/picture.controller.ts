import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PictureService } from './picture.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/decorators/roles.guard';

@Controller('picture')
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  // ADMIN:
  @Post('/crear_por_car/:idCar')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Param('idCar') idCar: number, @Body() createPictureDto: CreatePictureDto) {
    return this.pictureService.create(idCar,createPictureDto);
  }

  // gestionar las imágenes:
  @Get('/car/:idCar')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findOne(@Param('idCar') idCar: number) {
    return this.pictureService.findPicturesPorCar(idCar);
  }
  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.pictureService.remove(+id);
  }
}
