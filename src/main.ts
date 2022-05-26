import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { config } from './config';

(async () => {
   const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
   );
   await app.listen(config.APP_PORT);
})();