import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { DocumentRepository } from './document.repository';


@Module({
  controllers: [DocumentController],
  providers: [DocumentService, DocumentRepository],
  exports: [ DocumentRepository ]
})
export class DocumentModule {}
