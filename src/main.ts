import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import cors from './config/cors';

async function main() {
  const app = await NestFactory.create(AppModule, { cors });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}

main();
