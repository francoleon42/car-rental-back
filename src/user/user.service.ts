import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Rent } from '../rent/entities/rent.entity';
import { Repository } from 'typeorm';
import { CarService } from '../car/car.service';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly usuarioRepository: Repository<User>,
  ) {
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async actualizar(usuario: User, updateUserDto: UpdateUserDto) {
    usuario.firstName = updateUserDto.firstName;
    usuario.lastName = updateUserDto.lastName;
    usuario.dob = updateUserDto.dob;
    usuario.address = updateUserDto.address;
    usuario.country = updateUserDto.country;
    usuario.updatedAt = new Date();

    return this.usuarioRepository.save(usuario);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
