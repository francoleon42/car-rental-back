import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Document } from '../../document/entities/document.entity';
import { Role } from '../../common/enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column()
  country: string;

  @Column({
    type: 'enum',
    enum: Role,
    nullable: false,
  })
  role: Role;

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];

  @Column({ type: 'timestamp', nullable: true }) 
  createdAt: Date;
  
  @Column({ type: 'timestamp', nullable: true }) 
  updatedAt: Date;
  

}
