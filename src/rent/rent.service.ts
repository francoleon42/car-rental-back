import { Injectable } from '@nestjs/common';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { User } from '../user/entities/user.entity';
import { Rent } from './entities/rent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Column, CreateDateColumn, ManyToOne, Repository, UpdateDateColumn } from 'typeorm';
import { CarService } from '../car/car.service';

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(Rent)
    private readonly rentRepository: Repository<Rent>,
    private readonly carService: CarService,
  ) {}

  async create(createRentDto: CreateRentDto, user: User) {
    const car = await this.carService.obtenerCarPorID(createRentDto.idCarARentar);

    const rent = new Rent();
    rent.startingDate = createRentDto.startingDate;
    rent.dueDate = createRentDto.dueDate;
    rent.user = user;
    rent.rejected = false;
    rent.createdAt = new Date();
    rent.updatedAt = new Date();
    rent.car = car;
    rent.pricePerDay = car.pricePerDay

    return {
      id: rent.id,
      idCarARentar: rent.car.id,
      startingDate: rent.startingDate,
      dueDate: rent.dueDate,
    };
  }

  findAll() {
    return `This action returns all rent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rent`;
  }

  update(id: number, updateRentDto: UpdateRentDto) {
    return `This action updates a #${id} rent`;
  }

  remove(id: number) {
    return `This action removes a #${id} rent`;
  }
}
