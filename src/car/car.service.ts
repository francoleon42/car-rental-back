import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarRepository } from './car.repository';

import { CarResponseDTO } from './dto/car-response-dto';
import { Expose, plainToInstance } from 'class-transformer';
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
    @InjectRepository(CarRepository)
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

  async obtenerCar(id:number){
    const car = await this.carRepository.findOne({ where: { id } });
    return plainToInstance(CarResponseDTO, car);
  }

  async obtenerDetalle(id: number): Promise<CarDetalleResponseDTO> {
    const car = await this.carRepository.findCarByIdWithImages(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return plainToInstance(CarDetalleResponseDTO, {
      carResponseDTO: car,
      picturesResponseDTO: car.img,
    });

  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const car = await this.carRepository.findCarById(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} no encontrado`);
    }
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


}
