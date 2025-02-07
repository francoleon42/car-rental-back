import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDto } from './create-car.dto';
import { Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Picture } from '../../picture/entities/picture.entity';
import { Rent } from '../../rent/entities/rent.entity';

export class UpdateCarDto  {
  brand: string;
  model: string;
  color: string;
  passengers: number;
  ac: boolean;
  pricePerDay: number;
}
