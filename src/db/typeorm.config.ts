import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { Config } from '../config';

config({ path: '.env.template' });
config({ path: '.env', override: true });

export default new DataSource(Config.self.db as DataSourceOptions);
