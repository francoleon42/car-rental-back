import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
              @InjectRepository(User)
              private readonly userRepository: Repository<User>,
  ) {}

  //AUTH:
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

// usuario:
  @Patch('/actualizar')
  async actualizar(@Body() updateUserDto: UpdateUserDto) {
    //TODO : modificar con obtener el usuario logueado
    const id = 1;
    const user =  await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return this.userService.actualizar(user, updateUserDto);
  }

  //admin :
  @Get('/cliente')
  obtenerClientes() {
    return this.userService.obtenerClientes();
  }

  @Get('/informacion')
  async findOne() {
    //TODO : modificar con obtener el usuario logueado
    const id = 1;
    const user =  await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return this.userService.findOne(user.id);
  }
}
