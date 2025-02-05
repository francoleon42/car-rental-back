import { Expose, Type } from 'class-transformer';

export class CarResponseDTO {
  @Expose()
  id: number;

  @Expose()
  brand: string;

  @Expose()
  model: string;

  @Expose()
  color: string;

  @Expose()
  passengers: number;

  @Expose()
  ac: boolean;

  @Expose()
  pricePerDay: number;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<CarResponseDTO>) {
    Object.assign(this, partial);
  }
}
