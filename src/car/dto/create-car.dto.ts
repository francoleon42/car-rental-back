import { Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Picture } from '../../picture/entities/picture.entity';
import { Rent } from '../../rent/entities/rent.entity';
import { CreatePictureDto } from '../../picture/dto/create-picture.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarDto {

  brand: string;
  model: string;
  color: string;
  passengers: number;
  ac: boolean;
  pricePerDay: number;

}
