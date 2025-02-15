import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export class CreateDocumentDto {
  src : string;
  description: string;
  title: string;

}
