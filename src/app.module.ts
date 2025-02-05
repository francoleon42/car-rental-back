import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { Document } from './document/entities/document.entity';
import { Rent } from './rent/entities/rent.entity';
import { Car } from './car/entities/car.entity';
import { Picture } from './picture/entities/picture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    User,
    Document,
    Rent,
    Car,
    Picture,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Car, Picture,Rent,Document,User], 
      synchronize: true, 
      logging: true,  
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
