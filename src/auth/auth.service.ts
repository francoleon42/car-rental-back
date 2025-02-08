import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: signUpDto.email } });
    if (existingUser) throw new BadRequestException('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const user = this.userRepository.create({
      ...signUpDto,
      password: hashedPassword,
      role: Role.CLIENT,
    });

    return this.userRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new UnauthorizedException('Contraseña incorrecta');

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return; // No revelar que el email no existe

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora

    await this.userRepository.save(user);
    // Implementar envío de email aquí
  }

}