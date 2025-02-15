import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { DocumentRepository } from './document.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from '../rent/entities/rent.entity';
import { User } from '../user/entities/user.entity';
import { CarModule } from '../car/car.module';
import { Document } from './entities/document.entity';
import { S3Module } from 'src/s3/s3.module';


@Module({
  imports: [TypeOrmModule.forFeature([Document,User]),S3Module],
  controllers: [DocumentController],
  providers: [DocumentService, DocumentRepository],
  exports: [ DocumentRepository ]
})
export class DocumentModule {}
