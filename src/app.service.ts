import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseSeedService } from './database-seed.service'; 

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly seedService: DatabaseSeedService) {}

  async onModuleInit() {
    await this.seedService.seed();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
