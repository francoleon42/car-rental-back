import { Expose, Transform, Type } from 'class-transformer';
import { Role } from '../../common/enums/role.enum';
export class UsuarioResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  id:number;

  @Expose()
  @Transform(({ value }) => value ?? '')
  firstName: string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  lastName: string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  dob: Date;

  @Expose()
  @Transform(({ value }) => value ?? '')
  address: string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  country: string;
}