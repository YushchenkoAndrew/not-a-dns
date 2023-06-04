import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class Config {
  public readonly secrets = {
    secret: process.env.APPLICATION_SECRET,
  };

  public readonly db: Readonly<TypeOrmModuleOptions> = {
    type: 'sqlite',
    database: process.env.DB_FILE,
    entities: ['dist/**/*.entity{ .ts,.js}'],

    synchronize: false,
    migrations: ['dist/**/db/migrations/*{.ts,.js}'],
    migrationsRun: process.env.DB_MIGRATION === 'true',

    logging: process.env.DB_LOGS === 'true',
    keepConnectionAlive: true,
  };

  public readonly cors: Readonly<CorsOptions> = {
    origin: ['http://localhost:3002', 'http://127.0.0.1:3002'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  /**
   * This config param is dynamic, which means that it will have
   * a different value on each request
   */
  public dynamic = {
    /**
     * Default value of secret is loaded from env,
     * such approach only needs for migration
     */
    secret: process.env.APPLICATION_PEPPER,
  };

  private constructor() {}

  private static instance: Config;
  static get self(): Config {
    return (this.instance ||= new Config());
  }
}
