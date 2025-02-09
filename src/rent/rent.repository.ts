import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { Rent } from './entities/rent.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RentRepository extends Repository<Rent> {
  constructor(private dataSource: DataSource) {
    super(Rent, dataSource.createEntityManager());
  }

  async obtenerRentSolicitadas(): Promise<Rent[]> {
    return this.find({
      where: {
        rejected: false,
        admin: IsNull(),
        dueDate: MoreThanOrEqual(new Date()),
      },
      relations: ['car'],
    });
  }

  async obtenerSolicitudesDeUsuario(usuario: User): Promise<Rent[]> {
    return this.find({
      where: { user: usuario },
      relations: ['car'],
    });
  }

  async obtenerRentaPorID(id: number) {
    return  this.findOne({
      where: { id },
      relations: ['admin'],
    });
  }

  async findRentasByUserId(userId: number) {
    return this.createQueryBuilder('rent')
      .innerJoinAndSelect('rent.user', 'user')
      .where('user.id = :id', { id: userId })
      .getMany();
  }
}