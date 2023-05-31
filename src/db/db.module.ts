import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/main.db',
      entities: ['dist/**/*.entity{ .ts,.js}'],

      synchronize: false,
      // migrations: ['{dist,src}/db/migrations/*{.ts,.js}'],
      // migrationsRun: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class DbModule {}
