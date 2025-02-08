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

  // cliente :
  // cliente va a poder completar formulario basico para generaruna solicitud renta
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

// Como cliente Quiero ver el historial de mis solicitudes de alquiler (ver todas mis solicitudes rentas)
  @Get('/mis_solicitudes')
  @UseGuards(AuthGuard('jwt'))
  async  obtenerSolicitudesDeUsuario(@UserDecorator() user: User) {
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    if (user.role != Role.CLIENT) {
      throw new Error('El usuario no es cliente');
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
  @UseGuards(AuthGuard('jwt'))
  async rechazar(@Param('id') id: number, @UserDecorator() userAdmin: User) {
    if (!userAdmin) {
      throw new Error('Usuario no encontrado');
    }
    if (userAdmin.role != Role.ADMIN) {
      throw new Error('El usuario no es cliente');
    }
    return this.rentService.aceptar(userAdmin,+id);
  }

  @Patch('/rechazar/:id')
  @UseGuards(AuthGuard('jwt'))
  async aceptar(@Param('id') id: number,  @UserDecorator() userAdmin: User) {
    if (!userAdmin) {
      throw new Error('Usuario no encontrado');
    }
    if (userAdmin.role != Role.ADMIN) {
      throw new Error('El usuario no es cliente');
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
