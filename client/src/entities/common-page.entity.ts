import { ResponseProperty } from '../decorators/response-property';
import { CommonEntity } from './common.entity';

export abstract class CommonPageEntity extends CommonEntity {
  @ResponseProperty()
  page: number;

  @ResponseProperty()
  per_page: number;

  @ResponseProperty()
  total: number;

  @ResponseProperty()
  abstract items: unknown[];
}
