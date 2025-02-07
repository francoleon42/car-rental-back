import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

jest.setTimeout(60000);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET) debería retornar Hello World!', async () => {
    const response = await request(app.getHttpServer()).get('/').expect(200);
    expect(response.text).toBe('Hello World!');
  });

  it('/user/informacion (GET) debería retornar la información del usuario', async () => {
    const response = await request(app.getHttpServer()).get('/user/informacion').expect(200);

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

  it('/user/actualizar (PATCH) debería actualizar los datos del usuario', async () => {
    const updateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      dob: '1990-05-15',
      address: 'Calle Falsa 123',
      country: 'Argentina',
    };

    const response = await request(app.getHttpServer())
      .patch('/user/actualizar')
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject(updateData);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: expect.any(String),
        role: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it('/cars (GET) debería obtener los cars', async () => {
    const response = await request(app.getHttpServer()).get('/cars').expect(200);

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

  it('/cars/detalle/:id (GET) debería obtener los detalles de un car', async () => {
    const carId = 1;
    const response = await request(app.getHttpServer()).get(`/cars/detalle/${carId}`).expect(200);

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

  it('/rent/crear (POST) debería crear un alquiler', async () => {
    const rentData = {
      idCarARentar: 1,
      startingDate: '2025-02-10T09:00:00Z',
      dueDate: '2025-02-15T09:00:00Z',
    };

    const response = await request(app.getHttpServer())
      .post('/rent/crear')
      .send(rentData)
      .expect(201);

    expect(response.body).toEqual(rentData);
  });
});
