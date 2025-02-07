import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

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


  //acceso: admin
  //  EL admin va a poder subir autos (con sus pictures)
  @Post('/crear')
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }



}
