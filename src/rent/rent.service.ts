import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { User } from '../user/entities/user.entity';
import { Rent } from './entities/rent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Column,
  CreateDateColumn,
  IsNull,
  ManyToOne,
  MoreThan, MoreThanOrEqual,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';
import { CarService } from '../car/car.service';
import { plainToInstance } from 'class-transformer';
import { CarResponseDTO } from '../car/dto/car-response-dto';
import { ResponseRentDto } from './dto/response-rent.dto';
import { Car } from '../car/entities/car.entity';
import { CarDetailResponseDto } from '../car/dto/car-detail-response-dto';
import { RentRepository } from './rent.repository';
import { CarRepository } from '../car/car.repository';

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(RentRepository)
    private readonly rentRepository: RentRepository,
    @InjectRepository(CarRepository)
    private readonly carRepository: CarRepository,
  ) {
  }

  async create(createRentDto: CreateRentDto, user: User) {
    const car = await this.carRepository.findCarById(createRentDto.idCarARentar);
    if (!car) {
      throw new NotFoundException(`Car con Id ${createRentDto.idCarARentar} no encontrado`);
    }
    const rent = new Rent();
    rent.startingDate = createRentDto.startingDate;
    rent.dueDate = createRentDto.dueDate;
    rent.user = user;
    rent.rejected = false;
    rent.createdAt = new Date();
    rent.updatedAt = new Date();
    rent.car = car;
    rent.pricePerDay = car.pricePerDay;

    await this.rentRepository.save(rent);

    return {
      id: rent.id,
      idCarARentar: rent.car.id,
      startingDate: rent.startingDate,
      dueDate: rent.dueDate,
    };
  }

  async pendingRequests() {
    const rents: Rent[] = await this.rentRepository.findPendingRent();
    return rents.map(rent =>
      plainToInstance(ResponseRentDto, rent, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    );
  }

  async getMyRequests(usuario: User) {
    const rents: Rent[] = await this.rentRepository.findRentByUserId(usuario.id);
    if (!rents.length) {
      throw new NotFoundException('No requested rentals found.');
    }
    return rents.map(rent =>
      plainToInstance(ResponseRentDto, rent, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    );
  }

  async accept(admin: User, id: number) {
    const rent = await this.rentRepository.findRentById(id);
    if (!rent) {
      throw new NotFoundException(`Rent with ID ${id} not found`);
    }
    if (rent.admin) {
      throw new BadRequestException(`Rent ${id} is already approved or rejected`);
    }
    rent.rejected = false;
    rent.admin = admin;
    rent.acceptedDate = new Date();
    rent.updatedAt = new Date();

    await this.rentRepository.save(rent);
    return {
      mensaje: 'Rent approved',
      idRenta: rent.id,
      rejected: rent.rejected,
      acceptedDate: rent.acceptedDate,
      admin: rent.admin.email,
      updatedAt: rent.updatedAt,
    };
  }

  async reject(admin: User, id: number) {
    const rent = await this.rentRepository.findRentById(id);
    if (!rent) {
      throw new NotFoundException(`Rent with ID ${id} not found`);
    }
    if (rent.admin) {
      throw new BadRequestException(`Rent ${id} is already approved or rejected`);
    }
    rent.rejected = true;
    rent.admin = admin;
    rent.acceptedDate = null;
    rent.updatedAt = new Date();

    await this.rentRepository.save(rent);

    return {
      mensaje: 'Rent rejected',
      idRenta: rent.id,
      rejected: rent.rejected,
      acceptedDate: rent.acceptedDate,
      admin: rent.admin.email,
      updatedAt: rent.updatedAt,
    };
  }

  async getClientRents(idUser: number) {
    const rents = await this.rentRepository.findRentByUserId(idUser);

    return rents.map(rent =>
      plainToInstance(ResponseRentDto, rent, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    );
  }



}
