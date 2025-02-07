import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('/cars')
export class CarController {
  constructor(private readonly carService: CarService) {}
//acceso : usuario
  @Get()
  obtenerTodos() {
    return this.carService.findAll();
  }

  @Get('/detalle/:id')
  obtenerDetalle(@Param('id') id: number) {
    return this.carService.obtenerDetalle(+id);
  }

  // como admin quiero poder editar los detalles de un auto.
  @Patch('/actualizar/:id')
  async actualizar(@Param('id') id: number,@Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(id,updateCarDto);
  }

  //acceso: admin
  //  EL admin va a poder subir autos (con sus pictures)
  @Post('/crear')
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }



}
