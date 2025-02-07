import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarRepository } from './car.repository';

import { CarResponseDTO } from './dto/car-response-dto';
import { plainToInstance } from 'class-transformer';
import { PictureRepository } from '../picture/picture.repository';
import { CarDetalleResponseDTO } from './dto/car-detalle-response-dto';
import { Car } from './entities/car.entity';
import { PictureResponseDto } from '../picture/dto/picture-response-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Picture } from '../picture/entities/picture.entity';
import { CreatePictureDto } from '../picture/dto/create-picture.dto';
import { CarPicture } from '../common/enums/car-picture.enum';


@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: CarRepository,
  ) {
  }

  create(createCarDto: CreateCarDto) {
    const car = new Car();
    car.brand = createCarDto.brand;
    car.model = createCarDto.model;
    car.color = createCarDto.color;
    car.passengers = createCarDto.passengers;
    car.ac = createCarDto.ac;
    car.pricePerDay = createCarDto.pricePerDay;
    car.createdAt = new Date();
    car.updatedAt = new Date();
    this.carRepository.save(car);

    return {
      brand: car.brand,
      model: car.model,
      color: car.color,
      passengers: car.passengers,
      createdAt: car.createdAt,
    };
  }

  async findAll() {
    const cars = await this.carRepository.find();
    return cars.map(car =>
      plainToInstance(CarResponseDTO, car, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    );
  }

  async obtenerDetalle(id: number): Promise<CarDetalleResponseDTO> {
    const car = await this.carRepository.findOne({
      where: { id },
      relations: ['img'],
      loadEagerRelations: false,
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    return plainToInstance(CarDetalleResponseDTO, {
      carResponseDTO: car,
      picturesResponseDTO: car.img,
    });

  }

  async obtenerCarPorID(id: number) {
    const car = await this.carRepository.findOne(
      { where: { id: id } },
    );
    if (!car) {
      throw new Error('Car not found');
    }
    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const car = await  this.obtenerCarPorID(id);
    car.brand = updateCarDto.brand;
    car.model = updateCarDto.model;
    car.color = updateCarDto.color;
    car.passengers = updateCarDto.passengers;
    car.ac = updateCarDto.ac;
    car.pricePerDay = updateCarDto.pricePerDay;
    car.updatedAt = new Date();
    await this.carRepository.save(car);
    return {
      brand : car.brand ,
      model :car.model,
      color : car.color,
      updatedAt: car.updatedAt
    };
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
