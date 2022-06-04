import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from './config';
import path = require('path');
import { HttpExceptionFilter } from './exception.filter';

const { name, version, description } = require(path.join(process.cwd(), 'package.json'));

(async () => {
   const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
   );

   app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true, transform: true}));
   app.useGlobalFilters(new HttpExceptionFilter());

   const swaggerConfig = new DocumentBuilder()
      .setTitle(name)
      .setDescription(description)
      .setVersion(version)
      .build();
   const document = SwaggerModule.createDocument(app, swaggerConfig);
   SwaggerModule.setup('swagger', app, document);

   await app.listen(config.APP_PORT);
})();
