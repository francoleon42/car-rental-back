import { Role } from '../../common/enums/role.enum';
import { Column } from 'typeorm';

export class CreateUserDto {
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
