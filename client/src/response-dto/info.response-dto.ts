import { ResponseProperty } from '../decorators/response-property';
import { CommonResponseDto } from './common.response-dto';

export class InfoResponseDto extends CommonResponseDto {
  constructor(init?: Partial<InfoResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty()
  type: string;
}
