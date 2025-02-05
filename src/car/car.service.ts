import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarRepository } from './car.repository';

import { CarResponseDTO } from './dto/car-response-dto';
import { plainToInstance } from 'class-transformer';


@Injectable()
export class CarService {

  constructor(
    private carRepository: CarRepository,
  ) {}

  create(createCarDto: CreateCarDto) {
    return 'This action adds a new car';
  }

  async findAll() {
    const cars = await this.carRepository.find();
    return cars.map(car => 
      plainToInstance(CarResponseDTO, car, {
        excludeExtraneousValues: true, 
        enableImplicitConversion: true 
      })
    );
  }
  
  obtenerDetalle(id: number) {
    return `This action returns a #${id} car`;
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
