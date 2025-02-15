import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({  nullable: true }) 
  src: string;

  @Column()
  description: string;

  @Column()
  title: string;

  @Column({ type: 'timestamp', nullable: true }) 
  createdAt: Date;
  
  @Column({ type: 'timestamp', nullable: true }) 
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.documents, { onDelete: 'CASCADE' })
  user: User;
  
}
