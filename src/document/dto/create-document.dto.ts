import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export class CreateDocumentDto {
  url: string;
  src: string;
  description: string;
  title: string;

}
