import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { DocumentRepository } from './document.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from '../rent/entities/rent.entity';
import { User } from '../user/entities/user.entity';
import { CarModule } from '../car/car.module';
import { Document } from './entities/document.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Document,User])],
  controllers: [DocumentController],
  providers: [DocumentService, DocumentRepository],
  exports: [ DocumentRepository ]
})
export class DocumentModule {}
