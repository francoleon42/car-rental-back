import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Rent } from '../../rent/entities/rent.entity';
import { Picture } from '../../picture/entities/picture.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column()
  passengers: number;

  @Column({ default: false })
  ac: boolean;

  @Column()
  pricePerDay: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @OneToMany(() => Picture, (picture) => picture.car, { cascade: true })
  img: Picture[];


  @OneToMany(() => Rent, (rent) => rent.car)
  rents: Rent[];


}
