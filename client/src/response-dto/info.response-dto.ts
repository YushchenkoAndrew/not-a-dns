import { ResponseProperty } from '../decorators/response-property';
import { CommonResponseDto } from './common.response-dto';

export class InfoResponseDto extends CommonResponseDto {
  constructor(init?: Partial<InfoResponseDto>) {
    super();
    CommonResponseDto.assign(init, this);
  }

  @ResponseProperty()
  type: string;
}
