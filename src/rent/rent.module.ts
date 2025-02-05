import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { RentRepository } from './rent.repository';

@Module({
  controllers: [RentController],
  providers: [RentService, RentRepository],
  exports: [ RentRepository],
})
export class RentModule {}
