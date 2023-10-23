import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as N from '@nestjs/common';
import T from 'src/toolkit/toolkit';
import { AppModule } from 'src/modules/app/app_mdu';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new T.Validators.ValidationPipe());
  await app.listen(3000);
}

bootstrap();
