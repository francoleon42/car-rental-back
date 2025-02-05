import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { RentModule } from './rent/rent.module';
import { CarModule } from './car/car.module';
import { PictureModule } from './picture/picture.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    UserModule,
    DocumentModule,
    RentModule,
    CarModule,
    PictureModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [CarModule, PictureModule,RentModule,DocumentModule,UserModule],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
