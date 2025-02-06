import { Expose } from 'class-transformer';
import { CarResponseDTO } from '../../car/dto/car-response-dto';
import { Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CarPicture } from '../../common/enums/car-picture.enum';
import { Car } from '../../car/entities/car.entity';

export class PictureResponseDto {

  @Expose()
  src: string;
  @Expose()
  description: string;
  @Expose()
  title: string;
  @Expose()
  carPicture: string;

}