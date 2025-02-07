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
    @InjectRepository(Picture)
    private readonly pictureRepository: PictureRepository,
    @InjectRepository(Car)
    private readonly carRepository: CarRepository,
  ) {
  }

  async create(idCar: number, createPictureDto: CreatePictureDto) {
    const car = await this.carRepository.findOneBy({ id: idCar });
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

  findAll() {
    return `This action returns all picture`;
  }

  async findPicturesPorCar(id: number) {
    const car = await this.carRepository.findOne({
      where: { id: id },
      relations: ['img'],
    });
    if (!car) {
      throw new NotFoundException(`Car con ID ${id} no encontrado`);
    }
    return car.img.map(image =>
      plainToInstance(PictureResponseDto, image, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    );
  }

  async remove(id: number) {
    const picture = await this.pictureRepository.findOne({ where: { id: id } });
    if (!picture) {
      throw new NotFoundException(`Picture con ID ${id} no encontrado`);
    }
    return this.pictureRepository.remove(picture);
  }
}
