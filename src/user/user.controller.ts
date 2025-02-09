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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
              @InjectRepository(User)
              private readonly userRepository: Repository<User>,
  ) {}


// usuario cliente y admin :
  @Patch('/actualizar')
  @UseGuards(AuthGuard('jwt'))
  async actualizar(@Body() updateUserDto: UpdateUserDto, @UserDecorator() user: User) {
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return this.userService.actualizar(user, updateUserDto);
  }

  @Get('/informacion')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@UserDecorator() user: User) {
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return this.userService.findOne(user.id);
  }

  //solo admin :
  @Get('/cliente')
  obtenerClientes() {
    return this.userService.obtenerClientes();
  }

}
