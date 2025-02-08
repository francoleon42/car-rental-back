import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Document } from '../../document/entities/document.entity';
import { Role } from '../../common/enums/role.enum';
import { Rent } from '../../rent/entities/rent.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'date', nullable: true })
  dob?: Date;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  address?: string;


  @Column({ nullable: true })
  country?: string;

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

  
  @OneToMany(() => Rent, (rent) => rent.user)
  rents: Rent[];

  @OneToMany(() => Rent, (rent) => rent.admin)
  approvedRents: Rent[];


  // para forgot-password
  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

}
