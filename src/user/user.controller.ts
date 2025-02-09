import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { UserDecorator } from '../common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/decorators/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
              @InjectRepository(User)
              private readonly userRepository: Repository<User>,
  ) {}


// USUARIO:
  @Get('/informacion')
  @Roles('client', 'admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findOne(@UserDecorator() user: User) {
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return this.userService.findOne(user.id);
  }

  @Patch('/actualizar')
  @Roles('client', 'admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async actualizar(@Body() updateUserDto: UpdateUserDto, @UserDecorator() user: User) {
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return this.userService.actualizar(user, updateUserDto);
  }

  //ADMIN :
  @Get('/cliente')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  obtenerClientes() {
    return this.userService.obtenerClientes();
  }

}
