import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as N from '@nestjs/common';
import T from 'src/toolkit/toolkit';
import { AppModule } from 'src/modules/app/app_mdu';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new T.Validators.ValidationPipe());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
