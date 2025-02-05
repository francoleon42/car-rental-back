import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { RentModule } from './rent/rent.module';
import { CarModule } from './car/car.module';
import { PictureModule } from './picture/picture.module';

@Module({
  imports: [UserModule, DocumentModule, RentModule, CarModule, PictureModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
