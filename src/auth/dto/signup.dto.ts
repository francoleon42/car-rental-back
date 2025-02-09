import { IsDate, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  role: Role;
}