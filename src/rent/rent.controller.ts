import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  // usuario :
  //TODO :  Usuario va a poder completar formulario basico para generar una solicitud a la renta
  @Post()
  create(@Body() createRentDto: CreateRentDto) {
    return this.rentService.create(createRentDto);
  }

  // admin :
  //TODO:ver todos las solicitodes de renta ( todas las rentas sin aceptar)
  @Get()
  findAll() {
    return this.rentService.findAll();
  }

//TODO:  el admin va a poder aceptar o rechazar una renta
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentDto: UpdateRentDto) {
    return this.rentService.update(+id, updateRentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentService.remove(+id);
  }
}
