// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
   UserService, UserRepository,
  ],
  controllers:[UserController],
  exports: [UserRepository],
})
export class UserModule {}