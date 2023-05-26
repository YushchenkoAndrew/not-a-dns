import { CommonEntity } from './common.entity';

export interface HostEntity extends CommonEntity {
  alias: string;
  ip: string;
  port: number;
}
