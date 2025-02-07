import { PartialType } from '@nestjs/mapped-types';
import { CreateRentDto } from './create-rent.dto';
import { Expose } from 'class-transformer';
import { Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { User } from '../../user/entities/user.entity';
import { CarResponseDTO } from '../../car/dto/car-response-dto';

export class ResponseRentDto {
  @Expose()
  id: number;
  @Expose()
  pricePerDay: number;
  @Expose()
  acceptedDate: Date | null;
  @Expose()
  rejected: boolean;
  @Expose()
  startingDate: Date;
  @Expose()
  dueDate: Date;
  @Expose()
  endDate: Date | null;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;

}
