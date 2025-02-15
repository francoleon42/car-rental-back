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
import { CarDetailResponseDto } from '../car/dto/car-detail-response-dto';
import { PictureResponseDto } from './dto/picture-response-dto';
import { CarResponseDTO } from '../car/dto/car-response-dto';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class PictureService {
  constructor(
    @InjectRepository(PictureRepository)
    private readonly pictureRepository: PictureRepository,
    @InjectRepository(CarRepository)
    private readonly carRepository: CarRepository,
    private s3Service: S3Service,
  ) {
  }

  async create(file: Express.Multer.File, idCar: number, createPictureDto: CreatePictureDto) {
    const fileResponse = await this.s3Service.uploadFile(file);
    const car = await this.carRepository.findCarById(idCar);
    if (!car) {
      throw new Error('car not find');
    }
    const picture = new Picture();
    picture.car = car;
    picture.src = fileResponse.fileUrl;
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

  async getPicturesByCar(id: number) {
    const pictures = await this.pictureRepository.findPicturesByCar(id);
    if (!pictures || pictures.length === 0) {
      throw new NotFoundException(`No images were found for the car with ID ${id}`);
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
