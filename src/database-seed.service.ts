// database-seed.service.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user/user.repository';
import { CarRepository } from './car/car.repository';
import { PictureRepository } from './picture/picture.repository';
import { RentRepository } from './rent/rent.repository';
import { DocumentRepository } from './document/document.repository';
import { Role } from './common/enums/role.enum';
import { CarPicture } from './common/enums/car-picture.enum';

@Injectable()
export class DatabaseSeedService {
  constructor(
    private userRepository: UserRepository,
    private carRepository: CarRepository,
    private pictureRepository: PictureRepository,
    private rentRepository: RentRepository,
    private documentRepository: DocumentRepository,
  ) {}

  async seed() {
    // Limpiar todas las tablas
    await this.documentRepository.delete({});
    await this.rentRepository.delete({});
    await this.pictureRepository.delete({});
    await this.carRepository.delete({});
    await this.userRepository.delete({});


    // CREAR USUARIOS
    const client = this.userRepository.create({
      // firstName: 'John',
      // lastName: 'Doe',
      // dob: new Date('1995-05-20'),
      // email: 'john.doe@example.com',
      // address: '456 Client Avenue',
      // country: 'Canada',
      email: 'john.doe@example.com',
      password:"1234",
      role: Role.CLIENT,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const admin = this.userRepository.create({
      // firstName: 'Admin',
      // lastName: 'User',
      // dob: new Date('1980-01-15'),
      // address: '123 Admin Street',
      // country: 'USA',
      email: 'admin@rentalcars.com',
      password:"1234",
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date()
    });


    await this.userRepository.save([client, admin]);

    // CREAR AUTOS
    const toyota = this.carRepository.create({
      brand: 'Toyota',
      model: 'Corolla',
      color: 'Red',
      passengers: 5,
      ac: true,
      pricePerDay: 50,
    });

    const honda = this.carRepository.create({
      brand: 'Honda',
      model: 'Civic',
      color: 'Blue',
      passengers: 5,
      ac: true,
      pricePerDay: 45,
    });

    await this.carRepository.save([toyota, honda]);

    // CREAR PICTURES
    const toyotaPictures = this.pictureRepository.create([
      {
        src: 'toyota-front.jpg',
        description: 'Vista frontal',
        carPicture: CarPicture.FRONT,
        car: toyota,
        createdAt: new Date()
      },
      {
        src: 'toyota-side.jpg',
        description: 'Vista lateral',
        carPicture: CarPicture.SIDE,
        car: toyota,
        createdAt: new Date()
      },
    ]);

    const hondaPictures = this.pictureRepository.create([
      {
        src: 'honda-front.jpg',
        description: 'Frontal nuevo modelo',
        carPicture: CarPicture.FRONT,
        car: honda,
        createdAt: new Date()
      },
    ]);

    await this.pictureRepository.save([...toyotaPictures, ...hondaPictures]);

    // CREAR RENTAS
    const rent1 = this.rentRepository.create({
      pricePerDay: 50,
      startingDate: new Date('2024-03-01'),
      dueDate: new Date('2026-03-05'),
      rejected:false,
      car: toyota,
      user: client
    });

    const rent2 = this.rentRepository.create({
      pricePerDay: 50,
      startingDate: new Date('2024-04-01'),
      dueDate: new Date('2026-03-05'),
      rejected:false,
      car: toyota,
      user: client
    });

    const rent3 = this.rentRepository.create({
      pricePerDay: 45,
      startingDate: new Date('2024-03-10'),
      dueDate: new Date('2026-03-15'),
      rejected:true,
      car: honda,
      user: client,
      admin:admin
    });

    await this.rentRepository.save([rent1, rent2,rent3]);

    // CREAR DOCUMENTOS
    const license = this.documentRepository.create({
      title: 'Driver License',
      description: 'Valid driving license',
      src: 'license.jpg',
      url: '/documents/license.pdf',
      user: client,
    });

    await this.documentRepository.save(license);

    console.log('✅ Datos de prueba insertados correctamente!');
  }
}