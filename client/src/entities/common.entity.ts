import { ResponseProperty } from '../decorators/response-property';

export abstract class CommonEntity {
  @ResponseProperty()
  id: string;
}
