import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

jest.setTimeout(30000);

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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/cars (GET) obtener los cars', async () => {
    const response = await request(app.getHttpServer()).get('/cars').expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          brand: 'Toyota',
          model: 'Corolla',
          color: 'Red',
          passengers: 5,
          ac: true,
          pricePerDay: 50,
        }),
        expect.objectContaining({
          id: 2,
          brand: 'Honda',
          model: 'Civic',
          color: 'Blue',
          passengers: 5,
          ac: true,
          pricePerDay: 45,
        }),
      ]),
    );
  });


  it('/cars/detalle/:id (GET) obtener los detalles cars', async () => {
    const carId = 1;
    const response = await request(app.getHttpServer())
      .get(`/cars/detalle/${carId}`);

    expect(response.body).toEqual(
      expect.objectContaining({
        carResponseDTO: expect.objectContaining({
          id: carId,
          brand: expect.any(String),
          model: expect.any(String),
          color: expect.any(String),
          passengers: expect.any(Number),
          ac: expect.any(Boolean),
          pricePerDay: expect.any(Number),
          createdAt: expect.any(String),
          img: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              src: expect.any(String),
              description: expect.any(String),
              carPicture: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
        }),
        picturesResponseDTO: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            src: expect.any(String),
            description: expect.any(String),
            carPicture: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      }),
    );
  });

});


