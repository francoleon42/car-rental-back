import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Rent } from '../rent/entities/rent.entity';
import { Repository } from 'typeorm';
import { CarService } from '../car/car.service';
import { plainToInstance } from 'class-transformer';
import { CarResponseDTO } from '../car/dto/car-response-dto';
import { UsuarioResponseDto } from './dto/usuario-response-dto';
import { Role } from '../common/enums/role.enum';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
  }

  async getClients() {
    const users = await this.userRepository.findClients();
    return users.map(user =>
      plainToInstance(UsuarioResponseDto, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    );
  }

  async getUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return plainToInstance(UsuarioResponseDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  async update(usuario: User, updateUserDto: UpdateUserDto) {
    usuario.firstName = updateUserDto.firstName;
    usuario.lastName = updateUserDto.lastName;
    usuario.dob = updateUserDto.dob;
    usuario.address = updateUserDto.address;
    usuario.country = updateUserDto.country;
    usuario.updatedAt = new Date();

    await this.userRepository.save(usuario);
    return {
      id:usuario.id,
      firstName:usuario.firstName,
      lastName: usuario.lastName,
      dob:usuario.dob,
      address: usuario.address,
      country:usuario.country,
      updatedAt:usuario.updatedAt
    }
  }
}
