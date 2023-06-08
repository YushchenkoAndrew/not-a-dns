import { ResponseProperty } from '../decorators/response-property';
import { CommonEntity } from './common.entity';

/**
 * @deprecated
 */
export class InfoResponseDto extends CommonEntity {
  constructor(init?: Partial<InfoResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty()
  type: string;
}
