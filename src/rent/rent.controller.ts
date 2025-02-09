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
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/decorators/roles.guard';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService,
              @InjectRepository(User)
              private readonly userRepository: Repository<User>,
  ) {
  }

  // CLIENTE :
  @Post('/crear')
  @Roles('client')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async create(@Body() createRentDto: CreateRentDto, @UserDecorator() user: User) {
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    if (user.role != Role.CLIENT) {
      throw new Error('El usuario no es cliente');
    }
    return this.rentService.create(createRentDto, user);
  }

  @Get('/mis_solicitudes')
  @Roles('client')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async  obtenerSolicitudesDeUsuario(@UserDecorator() user: User) {
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    if (user.role != Role.CLIENT) {
      throw new Error('El usuario no es cliente');
    }
    return this.rentService.obtenerSolicitudesDeUsuario(user);
  }

  // ADMIN :
  @Get('/solicitadas')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  obtenerRentSolicitadas() {
    return this.rentService.obtenerRentSolicitadas();
  }

  @Patch('/aceptar/:id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async rechazar(@Param('id') id: number, @UserDecorator() userAdmin: User) {
    if (!userAdmin) {
      throw new Error('Usuario no encontrado');
    }
    return this.rentService.aceptar(userAdmin,+id);
  }

  @Patch('/rechazar/:id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async aceptar(@Param('id') id: number,  @UserDecorator() userAdmin: User) {
    if (!userAdmin) {
      throw new Error('Usuario no encontrado');
    }
    return this.rentService.rechazar(userAdmin,id);
  }

  @Get('cliente/:idCliente')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async obtenerRentasDeCliente(@Param('idCliente') id: number){
    return this.rentService.obtenerRentasDeCliente(id);
  }

}
