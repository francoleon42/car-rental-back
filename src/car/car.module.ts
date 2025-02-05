import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { CarRepository } from './car.repository';

@Module({
  controllers: [CarController],
  providers: [CarService, CarRepository],
  exports: [ CarRepository],
})
export class CarModule {}
