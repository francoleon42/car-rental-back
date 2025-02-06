import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserDto {
  firstName: string;
  lastName: string;
  dob: Date;
  address: string;
  country: string;
}
