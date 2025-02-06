import { Module } from '@nestjs/common';

import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from './entities/rent.entity';
import { CarModule } from '../car/car.module';
import { RentRepository } from './rent.repository';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rent,User]), CarModule],
  providers: [RentService,RentRepository],
  controllers: [RentController],
  exports:[RentRepository]
})
export class RentModule {}