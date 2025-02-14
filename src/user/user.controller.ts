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

  @Get('/information')
  @Roles('client', 'admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findOne(@UserDecorator() user: User) {
    if (!user) {
      throw new Error('User not found');
    }
    return this.userService.getUser(user.id);
  }

  @Patch('/update')
  @Roles('client', 'admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async actualizar(@Body() updateUserDto: UpdateUserDto, @UserDecorator() user: User) {
    if (!user) {
      throw new Error('User not found');
    }
    return this.userService.update(user, updateUserDto);
  }

  @Get('/client')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  obtenerClientes() {
    return this.userService.getClients();
  }

}
