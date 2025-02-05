import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseSeedService } from './database-seed.service';  // Asegúrate de importar correctamente el servicio de seeding

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly seedService: DatabaseSeedService) {}

  // El método onModuleInit se ejecuta cuando el módulo se ha inicializado
  async onModuleInit() {
    // Llama al método seed() para borrar y cargar los datos de ejemplo
    await this.seedService.seed();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
