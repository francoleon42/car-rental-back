import { Request, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../common/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from '../common/decorators/user.decorator';
import {JwtStrategy} from '../auth/strategies/jwt.strategy'

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
  @UseGuards(AuthGuard('jwt')) 
  async create(@Body() createRentDto: CreateRentDto, @UserDecorator() user: User) {
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    if (user.role != Role.CLIENT) {
      throw new Error('El usuario no es cliente');
    }
    return this.rentService.create(createRentDto, user);
  }

// Quiero ver el historial de mis solicitudes de alquiler (ver todas mis solicitudes rentas)
  @Get('/mis_solicitudes')
  async  obtenerSolicitudesDeUsuario() {
    //TODO : modificar con obtener el usuario logueado
    const id = 1;
    const user =  await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return this.rentService.obtenerSolicitudesDeUsuario(user);
  }
  // admin :
  //Como admin voy a querer listar todas las solicitudes de rent
  // ( todas las rentas sin aceptar)
  @Get('/solicitadas')
  obtenerRentSolicitadas() {
    return this.rentService.obtenerRentSolicitadas();
  }

// El admin va a poder aceptar o rechazar una renta
  @Patch('/aceptar/:id')
  async rechazar(@Param('id') id: number) {
    //TODO : modificar con obtener el admin logueado que va aceptar la rent y validar que sea admin
    const idAdmin = 2;
    const userAdmin =  await this.userRepository.findOneBy({ id: idAdmin });
    if (!userAdmin) {
      throw new Error('Usuario Admin no encontrado');
    }
    if (userAdmin.role !== Role.ADMIN) {
      throw new Error('El usuario no tiene rol de administrador');
    }
    return this.rentService.aceptar(userAdmin,+id);
  }

  @Patch('/rechazar/:id')
  async aceptar(@Param('id') id: number) {

    //TODO : modificar con obtener el admin logueado que va aceptar la rent y validar que sea admin
    const idAdmin = 2;
    const userAdmin =  await this.userRepository.findOneBy({ id: idAdmin });
    if (!userAdmin) {
      throw new Error('Usuario Admin no encontrado');
    }
    if (userAdmin.role !== Role.ADMIN) {
      throw new Error('El usuario no tiene rol de administrador');
    }
    return this.rentService.rechazar(userAdmin,id);
  }

  @Get('cliente/:idCliente')
  async obtenerRentasDeCliente(@Param('idCliente') id: number){
    return this.rentService.obtenerRentasDeCliente(id);
  }


  private getLoggedUser(req): User {
    return req.user;
  }
}
