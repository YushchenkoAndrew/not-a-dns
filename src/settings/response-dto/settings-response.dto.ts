import { ResponseProperty } from '../../common/decorators/response-property';
import { CommonResponseDto } from '../../common/response-dto/common-response.dto';

export class SettingsResponseDto extends CommonResponseDto {
  constructor(init?: Partial<SettingsResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty((e) => e.nanoid)
  id: string = '';

  @ResponseProperty()
  name: string = '';

  @ResponseProperty()
  mode: boolean = false;
}
