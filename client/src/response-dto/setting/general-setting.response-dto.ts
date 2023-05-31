import { ResponseProperty } from '../../decorators/response-property';
import { CommonResponseDto } from '../common.response-dto';

export class GeneralSettingResponseDto extends CommonResponseDto {
  constructor(init?: Partial<GeneralSettingResponseDto>) {
    super();
    CommonResponseDto.assign(init, this);
  }

  @ResponseProperty()
  mode: boolean;
}
