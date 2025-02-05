import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { CarPicture } from 'src/common/enums/car-picture.enum';

@Entity()
export class Picture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  src: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({
    type: 'enum',
    enum: CarPicture,
    default: CarPicture.OTHER,
  })
  carPicture: CarPicture;

  @Column({ type: 'timestamp', nullable: true })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Car, (car) => car.img, { nullable: false, onDelete: 'CASCADE' })
  car: Car;
}
