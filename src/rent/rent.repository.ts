import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Rent } from './entities/rent.entity';

@Injectable()
export class RentRepository extends Repository<Rent> {
  constructor(private dataSource: DataSource) {
    super(Rent, dataSource.createEntityManager());
  }
}