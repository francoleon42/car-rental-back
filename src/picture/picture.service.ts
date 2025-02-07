import { Injectable } from '@nestjs/common';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../car/entities/car.entity';
import { CarRepository } from '../car/car.repository';
import { Picture } from './entities/picture.entity';
import { PictureRepository } from './picture.repository';
import { CarPicture } from '../common/enums/car-picture.enum';

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

  findOne(id: number) {
    return `This action returns a #${id} picture`;
  }

  update(id: number, updatePictureDto: UpdatePictureDto) {
    return `This action updates a #${id} picture`;
  }

  remove(id: number) {
    return `This action removes a #${id} picture`;
  }
}
