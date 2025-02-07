import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService,
              @InjectRepository(User)
              private readonly userRepository: Repository<User>,
  ) {
  }

  // usuario :
  // Usuario va a poder completar formulario basico para generaruna solicitud renta
  @Post('/crear')
  async create(@Body() createRentDto: CreateRentDto) {
    //TODO : modificar con obtener el usuario logueado
    const id = 1;
    const user = await await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return this.rentService.create(createRentDto, user);
  }

  // admin :
  //Como admin voy a querer listar todas las solicitudes de rent
  // ( todas las rentas sin aceptar)
  @Get('/solicitadas')
  findAll() {
    return this.rentService.obtenerRentSolicitadas();
  }

//TODO:  el admin va a poder aceptar o rechazar una renta
  @Patch('/aceptar/:id')
  rechazar(@Param('id') id: number, @Body() updateRentDto: UpdateRentDto) {
    return this.rentService.update(+id, updateRentDto);
  }
  @Patch('/rechazar:id')
  aceptar(@Param('id') id: number, @Body() updateRentDto: UpdateRentDto) {
    return this.rentService.update(+id, updateRentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentService.remove(+id);
  }
}
