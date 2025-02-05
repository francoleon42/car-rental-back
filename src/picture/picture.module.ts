import { Module } from '@nestjs/common';
import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';
import { PictureRepository } from './picture.repository';

@Module({
  controllers: [PictureController],
  providers: [PictureService,PictureRepository],
  exports: [ PictureRepository]
})
export class PictureModule {}
