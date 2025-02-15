import { Module } from '@nestjs/common';
import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';
import { PictureRepository } from './picture.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from '../rent/entities/rent.entity';
import { CarModule } from '../car/car.module';
import { Picture } from './entities/picture.entity';
import { User } from '../user/entities/user.entity';
import { Car } from '../car/entities/car.entity';
import { S3Module } from '../s3/s3.module';

@Module({

  imports: [TypeOrmModule.forFeature([Picture,Car]),CarModule, S3Module],
  controllers: [PictureController],
  providers: [PictureService,PictureRepository],
  exports: [ PictureRepository]
})
export class PictureModule {}
