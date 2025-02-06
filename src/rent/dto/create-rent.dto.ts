import { Expose } from 'class-transformer';
import { Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { User } from '../../user/entities/user.entity';

export class CreateRentDto {

  idCarARentar: number
  startingDate: Date;
  dueDate: Date;

  constructor(partial: Partial<CreateRentDto>) {
    Object.assign(this, partial);
  }
}
