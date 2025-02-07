import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CarPicture } from '../../common/enums/car-picture.enum';

export class CreatePictureDto {
  src: string;
  description: string;
  title: string;
  carPicture: string;
}
