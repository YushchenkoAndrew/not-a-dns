import { CommonEntity } from './common.entity';

export interface HostEntity extends CommonEntity {
  id: string;
  favorite: boolean;
  alias: string;
  ip: string;
  port: number;
}
