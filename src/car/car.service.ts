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


@Injectable()
export class CarService {
  private pictureRepository: PictureRepository;

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

  async obtenerDetalle(id: number): Promise<CarDetalleResponseDTO> {
    const car = await this.carRepository.findOne({
      where: { id },
      relations: ['img'],
      loadEagerRelations: false
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    return plainToInstance(CarDetalleResponseDTO, {
      carResponseDTO: car,
      picturesResponseDTO: car.img,
    });

  }


  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
