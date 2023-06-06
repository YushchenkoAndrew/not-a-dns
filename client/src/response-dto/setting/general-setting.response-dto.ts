import { ResponseProperty } from '../../decorators/response-property';
import { CommonResponseDto } from '../common.response-dto';

export class GeneralSettingResponseDto extends CommonResponseDto {
  @ResponseProperty()
  id: string;

  @ResponseProperty()
  name: string;

  @ResponseProperty()
  mode: boolean;
}
