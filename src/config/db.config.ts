import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'sqlite',
  database: 'db/main.db',
  entities: ['dist/**/*.entity{ .ts,.js}'],

  synchronize: false,
  migrations: ['{dist,src}/db/migrations/*{.ts,.js}'],
  migrationsRun: true,
});
