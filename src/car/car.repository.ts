import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Car } from './entities/car.entity';

@Injectable()
export class CarRepository extends Repository<Car> {
  constructor(private dataSource: DataSource) {
    super(Car, dataSource.createEntityManager());
  }


  async findCarWithImages(id: number) {
    return this.findOne({
      where: { id },
      relations: ['img'],
    });
  }


  async findCarByIdWithImages(id: number) {
    return await this.findOne({
      where: { id },
      relations: ['img'],
      loadEagerRelations: false,
    });
  }

  async findCarById(id: number): Promise<Car | null> {
    return await this.findOne({ where: { id } });
  }

}