import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/decorators/roles.guard';

@Controller('/cars')
export class CarController {
  constructor(private readonly carService: CarService) {
  }

//USUARIO
  @Get()
  @Roles('client', 'admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  obtenerTodos() {
    return this.carService.findAll();
  }

  @Get('/:id')
  @Roles( 'admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  obtenerCar(@Param('id') id: number) {
    return this.carService.obtenerCar(id);
  }
//CLIENTE
  @Get('/detalle/:id')
  @Roles('client')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  obtenerDetalle(@Param('id') id: number) {
    return this.carService.obtenerDetalle(+id);
  }

// ADMIN
  @Post('/crear')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Patch('/actualizar/:id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async actualizar(@Param('id') id: number, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(id, updateCarDto);
  }

}
