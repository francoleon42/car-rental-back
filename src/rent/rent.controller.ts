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

  @Post('/create')
  @Roles('client')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async create(@Body() createRentDto: CreateRentDto, @UserDecorator() user: User) {
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role != Role.CLIENT) {
      throw new Error('User is not a client');
    }
    return this.rentService.create(createRentDto, user);
  }

  @Get('/my-requests')
  @Roles('client')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async  getMyRequests(@UserDecorator() user: User) {
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role != Role.CLIENT) {
      throw new Error('User is not a client');
    }
    return this.rentService.getMyRequests(user);
  }

  @Get('/pending-requests')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  obtenerRentSolicitadas() {
    return this.rentService.pendingRequests();
  }

  @Patch('/accept/:id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async accept(@Param('id') id: number, @UserDecorator() userAdmin: User) {
    if (!userAdmin) {
      throw new Error('User not found');
    }
    return this.rentService.accept(userAdmin,+id);
  }

  @Patch('/reject/:id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async reject(@Param('id') id: number,  @UserDecorator() userAdmin: User) {
    if (!userAdmin) {
      throw new Error('User not found');
    }
    return this.rentService.reject(userAdmin,id);
  }

  @Get('client/:clientId')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getClientRents(@Param('clientId') id: number){
    return this.rentService.getClientRents(id);
  }

}
