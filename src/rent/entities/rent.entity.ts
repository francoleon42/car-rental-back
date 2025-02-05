import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Rent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pricePerDay: number;


  @Column({ type: 'timestamp', nullable: true })
  acceptedDate: Date | null;

  @Column({ default: false })
  rejected: boolean;

  @Column({ type: 'timestamp' })
  startingDate: Date;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Car, (car) => car.rents, { eager: true })
  car: Car;

  @ManyToOne(() => User, (user) => user.rents)
  user: User;
  
  @ManyToOne(() => User, (user) => user.approvedRents, { nullable: true })
  admin: User;
}
