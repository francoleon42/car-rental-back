import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/user/user.service';
import { Role } from '../src/common/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../src/user/user.repository';
import { HttpService } from '@nestjs/axios'; 


jest.setTimeout(60000);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;  
  let authTokenClient: string;
  let authTokenAdmin: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    try {
      //CLIENTE
      const rentDataCliente = {
        email: 'john.doe@example.com',
        password: '1234',
      };
      const responseCliente = await request(app.getHttpServer())
        .post('/auth/login')
        .send(rentDataCliente);
      authTokenClient = responseCliente.body.access_token;

      ///ADMIN
      const rentDataAdmin = {
        email: 'admin@rentalcars.com',
        password: '1234',
      };
      const responseAdmin = await request(app.getHttpServer())
        .post('/auth/login')
        .send(rentDataAdmin);
      authTokenAdmin = responseAdmin.body.access_token;

    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  //==========USER=======

  it('/user/information (GET) debería retornar la información del usuario', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/information')
      .set('Authorization', `Bearer ${authTokenClient}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        firstName: expect.any(String),
        lastName: expect.any(String),
        dob: expect.any(String),
        address: expect.any(String),
        country: expect.any(String),
      }),
    );
  });
  it('/user/update (PATCH) debería actualizar los datos del usuario', async () => {
    const updateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      dob: '1990-05-15',
      address: 'Calle Falsa 123',
      country: 'Argentina',
    };

    const response = await request(app.getHttpServer())
      .patch('/user/update')
      .set('Authorization', `Bearer ${authTokenClient}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject(updateData);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        firstName:expect.any(String),
        lastName:expect.any(String),
        dob:expect.any(String),
        address:expect.any(String),
        country:expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });
  it(' /user/client (GET)- debería retornar la lista de clientes', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/client')
      .set('Authorization', `Bearer ${authTokenAdmin}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          dob: expect.any(String),
          address: expect.any(String),
          country: expect.any(String),
        }),
      ]),
    );
  });


  // ==========CAR ==========

  it('/cars/create (POST) Debe crear un carro y devolver los datos correctamente', async () => {
    const carData = {
      brand: 'Toyota',
      model: 'modelA',
      color: 'Red',
      passengers: 5,
      ac: true,
      pricePerDay: 50,
    };

    const response = await request(app.getHttpServer())
      .post('/cars/create')
      .send(carData)
      .set('Authorization', `Bearer ${authTokenAdmin}`)
      .expect(201);

    expect(response.body).toMatchObject({
      brand: carData.brand,
      model: carData.model,
      color: carData.color,
      passengers: carData.passengers,
      createdAt: expect.any(String),
    });
  });
  it('/cars (GET) debería obtener los cars', async () => {
    const response = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${authTokenClient}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          brand: expect.any(String),
          model: expect.any(String),
          color: expect.any(String),
          passengers: expect.any(Number),
          ac: expect.any(Boolean),
          pricePerDay: expect.any(Number),
        }),
      ]),
    );
  });
  it('/cars/detail/:id (GET) debería obtener los detalles de un car', async () => {
    const carId = 1;
    const response = await request(app.getHttpServer())
      .get(`/cars/detail/${carId}`)
      .set('Authorization', `Bearer ${authTokenClient}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        carResponseDTO: expect.objectContaining({
          id: expect.any(Number),
          brand: expect.any(String),
          model: expect.any(String),
          color: expect.any(String),
          passengers: expect.any(Number),
          ac: expect.any(Boolean),
          pricePerDay: expect.any(Number),
          img: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              src: expect.any(String),
            }),
          ]),
        }),
      }),
    );
  });
  it('/cars/update/:id (PATCH) debería actualizar los datos de un carro', async () => {
    const carId = 1;
    const updateData = {
      brand: 'Editado',
      model: 'Editado',
      color: 'Editado',
      passengers: 5,
      ac: true,
      pricePerDay: 0,
    };

    const response = await request(app.getHttpServer())
      .patch(`/cars/update/${carId}`)
      .set('Authorization', `Bearer ${authTokenAdmin}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      brand: updateData.brand,
      model: updateData.model,
      color: updateData.color,
      updatedAt: expect.any(String),
    });
  });


//========== PICTURE ================

  it('/picture/upload-for-car/:id (POST) debería crear una imagen para un carro', async () => {
    const carId = 1;
    const pictureData = {
      src: 'https://example.com/car-image.jpg',
      description: 'Vista frontal del coche',
      title: 'Toyota Corolla 2023 - Frontal',
      carPicture: 'front',
    };

    const response = await request(app.getHttpServer())
      .post(`/picture/upload-for-car/${carId}`)
      .set('Authorization', `Bearer ${authTokenAdmin}`)
      .send(pictureData)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        src: pictureData.src,
        description: pictureData.description,
        title: pictureData.title,
        createdAt: expect.any(String),
      }),
    );
  });
  it('/picture/car/:id (GET) debería obtener todas las imágenes de un carro', async () => {
    const carId = 1;

    const response = await request(app.getHttpServer())
      .get(`/picture/car/${carId}`)
      .set('Authorization', `Bearer ${authTokenAdmin}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          src: expect.any(String),
          description: expect.any(String),
          title: expect.any(String), // Puede ser null
          carPicture: expect.any(String),
        }),
      ]),
    );
  });
  it('/picture/:id (DELETE) debería eliminar una imagen y devolver sus datos', async () => {
    const pictureId = 1;

    const response = await request(app.getHttpServer())
      .delete(`/picture/${pictureId}`)
      .set('Authorization', `Bearer ${authTokenAdmin}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        src: expect.any(String),
        description: expect.any(String),
        title: expect.any(String),
        carPicture: expect.any(String),
        date: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  //======== RENTA  =================

  it('/rent/create (POST) Debe crear una renta y devolver los datos correctamente', async () => {
    const rentData = {
      idCarARentar: 1,
      startingDate: '2025-02-10T09:00:00Z',
      dueDate: '2025-02-15T09:00:00Z',
    };

    const response = await request(app.getHttpServer())
      .post('/rent/create')
      .send(rentData)
      .set('Authorization', `Bearer ${authTokenClient}`)
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      idCarARentar: rentData.idCarARentar,
      startingDate: rentData.startingDate,
      dueDate: rentData.dueDate,
    });
  });
  it('/rent/pending-requests (GET)- debería devolver la lista de rentas solicitadas', async () => {
    const response = await request(app.getHttpServer())
      .get('/rent/pending-requests')
      .set('Authorization', `Bearer ${authTokenAdmin}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          pricePerDay: expect.any(Number),
          acceptedDate: null,
          rejected: expect.any(Boolean),
          startingDate: expect.any(String),
          dueDate: expect.any(String),
          endDate: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    );
  });
  it(' /rent/my-requests (GET)- debería devolver la lista de solicitudes de renta del usuario', async () => {
    const response = await request(app.getHttpServer())
      .get('/rent/my-requests')
      .set('Authorization', `Bearer ${authTokenClient}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          pricePerDay: expect.any(Number),
          acceptedDate: null,
          rejected: expect.any(Boolean),
          startingDate: expect.any(String),
          dueDate: expect.any(String),
          endDate: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    );
  });
  it(' /rent/client/:idClient (GET) - debería devolver la lista de solicitudes de renta del cliente con ID por paramatro', async () => {
    const response = await request(app.getHttpServer())
      .get('/rent/client/1')
      .set('Authorization', `Bearer ${authTokenAdmin}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          pricePerDay: expect.any(Number),
          acceptedDate: null,
          rejected: expect.any(Boolean),
          startingDate: expect.any(String),
          dueDate: expect.any(String),
          endDate: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    );
  });
  it(' /rent/accept/:idRent (PATCH)- debería aprobar la renta ', async () => {
    const response = await request(app.getHttpServer())
      .patch('/rent/accept/1')
      .set('Authorization', `Bearer ${authTokenAdmin}`)
      .expect(200);

    expect(response.body).toEqual({
      mensaje: 'Rent approved',
      idRenta: 1,
      rejected: false,
      acceptedDate: expect.any(String),
      admin: 'admin@rentalcars.com',
      updatedAt: expect.any(String),
    });
  });
  it(' /rent/reject/:idRent  (PATCH)- debería rechazar la renta ', async () => {
    const response = await request(app.getHttpServer())
      .patch('/rent/reject/2')
      .set('Authorization', `Bearer ${authTokenAdmin}`)
      .expect(200);

    expect(response.body).toEqual({
      mensaje: 'Rent rejected',
      idRenta: 2,
      rejected: true,
      acceptedDate: null,
      admin: 'admin@rentalcars.com',
      updatedAt: expect.any(String),
    });
  });

  
// ======== DOCUMENTO ==========
describe('Document Controller (e2e)', () => {
  it('/document (GET) - debería obtener documentos correctamente', async () => {
    const response = await request(app.getHttpServer())
      .get('/document')
      .set('Authorization', `Bearer ${authTokenClient}`)
      .expect(200);

    // Verificación básica de estructura
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: expect.any(String),
          src: expect.any(String),
          description: expect.any(String),
          title: expect.any(String),
          createdAt: expect.any(Object), // Permite String o null
        }),
      ]),
    );
  });
});

});
