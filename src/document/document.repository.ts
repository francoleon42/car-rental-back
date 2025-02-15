
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentRepository extends Repository<Document> {
  constructor(private dataSource: DataSource) {
    super(Document, dataSource.createEntityManager());
  }

  async findByUserId(userId: number): Promise<Document[]> {
    return this.find({
      where: { user: { id: userId } }, 
      order: { createdAt: 'DESC' } 
    });
  }
  
}