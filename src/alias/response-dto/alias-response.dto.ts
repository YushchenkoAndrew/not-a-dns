import { ResponseProperty } from '../../common/decorators/response-property';
import { CommonResponseDto } from '../../common/response-dto/common-response.dto';
import { AliasLinksResponseDto } from './alias-links-response.dto';

export class AliasResponseDto extends CommonResponseDto {
  constructor(init?: Partial<AliasResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty((e) => e.nanoid)
  id: string = '';

  @ResponseProperty()
  name: string = '';

  @ResponseProperty((e) => e.value || e.secret?.value || '')
  value: string = '';

  @ResponseProperty()
  favorite: boolean = false;

  @ResponseProperty((e) => new AliasLinksResponseDto().build(e))
  children: AliasLinksResponseDto = null;

  // TODO:
  // parent:
}
