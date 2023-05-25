import { ResponseProperty } from '../../decorators/response-property';
import { CommonResponseDto } from '../common.response-dto';

export class GeneralSettingResponseDto extends CommonResponseDto {
  constructor(init?: Partial<GeneralSettingResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty()
  mode: { state: boolean; name: string; icon: string };
}
