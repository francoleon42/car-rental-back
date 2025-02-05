import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Car } from './entities/car.entity';

@Injectable()
export class CarRepository extends Repository<Car> {
  constructor(private dataSource: DataSource) {
    super(Car, dataSource.createEntityManager());
  }
}