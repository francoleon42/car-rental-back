import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { Document } from './document/entities/document.entity';
import { Rent } from './rent/entities/rent.entity';
import { Car } from './car/entities/car.entity';
import { Picture } from './picture/entities/picture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeedService } from './database-seed.service';
import { UserRepository } from './user/user.repository';

import { CarModule } from './car/car.module';
import { PictureModule } from './picture/picture.module';
import { RentModule } from './rent/rent.module';
import { DocumentModule } from './document/document.module';
import { AuthModule } from './auth/auth.module';



import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    AuthModule,
    UserModule,
    DocumentModule,
    RentModule,
    CarModule,
    PictureModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Car, Picture,Rent,Document,User],
      synchronize: true,
      dropSchema: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService,DatabaseSeedService],
})
export class AppModule {}


