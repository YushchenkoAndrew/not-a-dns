import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { SecretGuard } from './secret/guards/secret.guard';

async function main() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalGuards(new SecretGuard());
  await app.listen(3000);
}

main();
