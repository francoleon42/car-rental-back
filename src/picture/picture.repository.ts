import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Picture } from './entities/picture.entity';

@Injectable()
export class PictureRepository extends Repository<Picture> {

  constructor(private dataSource: DataSource) {
    super(Picture, dataSource.createEntityManager());
  }

  async findPicturesByCar(id: number) {
    return this.createQueryBuilder('picture')
      .innerJoinAndSelect('picture.car', 'car')
      .where('car.id = :id', { id })
      .getMany();
  }

  async removePictureById(id: number) {
    const picture = await this.findOne({ where: { id } });
    if (!picture) {
      throw new NotFoundException(`Picture con ID ${id} no encontrado`);
    }
    return this.remove(picture);
  }

}