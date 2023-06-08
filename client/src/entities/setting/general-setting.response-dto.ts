import { ResponseProperty } from '../../decorators/response-property';
import { CommonEntity } from '../common.entity';

export class SettingResponseDto extends CommonEntity {
  @ResponseProperty()
  id: string;

  @ResponseProperty()
  name: string;

  @ResponseProperty()
  mode: boolean;
}
