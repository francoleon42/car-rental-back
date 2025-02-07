import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { User } from '../user/entities/user.entity';
import { Rent } from './entities/rent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Column,
  CreateDateColumn,
  IsNull,
  ManyToOne,
  MoreThan,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';
import { CarService } from '../car/car.service';
import { plainToInstance } from 'class-transformer';
import { CarResponseDTO } from '../car/dto/car-response-dto';
import { ResponseRentDto } from './dto/response-rent.dto';
import { Car } from '../car/entities/car.entity';

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(Rent)
    private readonly rentRepository: Repository<Rent>,
    private readonly carService: CarService,
  ) {
  }

  async create(createRentDto: CreateRentDto, user: User) {
    const car = await this.carService.obtenerCarPorID(createRentDto.idCarARentar);

    const rent = new Rent();
    rent.startingDate = createRentDto.startingDate;
    rent.dueDate = createRentDto.dueDate;
    rent.user = user;
    rent.rejected = false;
    rent.createdAt = new Date();
    rent.updatedAt = new Date();
    rent.car = car;
    rent.pricePerDay = car.pricePerDay;

    await this.rentRepository.save(rent);

    return {
      id: rent.id,
      idCarARentar: rent.car.id,
      startingDate: rent.startingDate,
      dueDate: rent.dueDate,
    };
  }


  async obtenerRentSolicitadas() {
    const rents: Rent[] = await this.rentRepository.find({
      where: {
        rejected: false,
        admin: IsNull(),
      },
    });
    return rents.map(rent =>
      plainToInstance(ResponseRentDto, rent, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    );
  }

  async obtenerSolicitudesDeUsuario(usuario: User) {
    const rents = await this.rentRepository.find({
      where: { user: usuario },
      relations: ['car', 'admin'],
    });
    return rents.map(rent =>
      plainToInstance(ResponseRentDto, rent, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    );
  }


  async aceptar(admin: User, id: number) {
    const rent = await this.rentRepository.findOne({
      where: { id },
      relations: ['admin']
    });

    if (!rent) {
      throw new NotFoundException(`Rent con ID ${id} no encontrado`);
    }
    if (rent.admin) {
      throw new BadRequestException(`Rent ${id} ya está aprobado o rechazado`);
    }
    rent.rejected = false;
    rent.admin = admin;
    rent.acceptedDate = new Date();
    rent.updatedAt = new Date();

    await this.rentRepository.save(rent);
    return {
      mensaje: "Rent aprobada",
      idRenta: rent.id,
      rejected: rent.rejected,
      acceptedDate :  rent.acceptedDate,
      admin:   rent.admin.email,
      updatedAt: rent.updatedAt,
    };
  }

  async rechazar(admin: User, id: number) {
    const rent = await this.rentRepository.findOne({
      where: { id },
      relations: ['admin']
    });
    if (!rent) {
      throw new NotFoundException(`Rent con ID ${id} no encontrado`);
    }
    if (rent.admin) {
      throw new BadRequestException(`Rent ${id} ya está aprobado o rechazado`);
    }
    rent.rejected = true;
    rent.admin = admin;
    rent.acceptedDate = null;
    rent.updatedAt = new Date();

    await this.rentRepository.save(rent);

    return {
      mensaje: "Rent rechazada",
      idRenta: rent.id,
      rejected: rent.rejected,
      acceptedDate :  rent.acceptedDate,
      admin:   rent.admin.email,
      updatedAt: rent.updatedAt,
    };
  }

  update(id: number, updateRentDto: UpdateRentDto) {
    return `This action updates a #${id} rent`;
  }

}
