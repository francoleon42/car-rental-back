import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../car/entities/car.entity';
import { CarRepository } from '../car/car.repository';
import { Picture } from './entities/picture.entity';
import { PictureRepository } from './picture.repository';
import { CarPicture } from '../common/enums/car-picture.enum';
import { plainToInstance } from 'class-transformer';
import { CarDetalleResponseDTO } from '../car/dto/car-detalle-response-dto';
import { PictureResponseDto } from './dto/picture-response-dto';
import { CarResponseDTO } from '../car/dto/car-response-dto';

@Injectable()
export class PictureService {
  constructor(
    @InjectRepository(PictureRepository)
    private readonly pictureRepository: PictureRepository,
    @InjectRepository(CarRepository)
    private readonly carRepository: CarRepository,
  ) {
  }

  async create(idCar: number, createPictureDto: CreatePictureDto) {
    const car = await this.carRepository.findCarById(idCar);
    if (!car) {
      throw new Error('car no encontrado');
    }
    const picture = new Picture();
    picture.car = car;
    picture.src = createPictureDto.src;
    picture.description = createPictureDto.description;
    picture.title = createPictureDto.title;
    picture.carPicture = CarPicture[createPictureDto.carPicture.toUpperCase() as keyof typeof CarPicture] || CarPicture.OTHER;
    picture.date = new Date();
    picture.createdAt = new Date();
    picture.updatedAt = new Date();

    await this.pictureRepository.save(picture);

    return {
      src: picture.src,
      description: picture.description,
      title: picture.title,
      createdAt: picture.createdAt,
    };
  }

  async obtenerPicturesPorCar(id: number) {
    const pictures = await this.pictureRepository.findPicturesByCar(id);
    if (!pictures || pictures.length === 0) {
      throw new NotFoundException(`No se encontraron imágenes para el coche con ID ${id}`);
    }
    return pictures.map(image =>
      plainToInstance(PictureResponseDto, image, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    );
  }

  async remove(id: number) {
    return this.pictureRepository.removePictureById(id);
  }
}
