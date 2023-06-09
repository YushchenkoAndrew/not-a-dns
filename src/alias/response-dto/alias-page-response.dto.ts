import { ResponseProperty } from '../../common/decorators/response-property';
import { PageResponseDto } from '../../common/response-dto/page-response.dto';
import { AliasLinksResponseDto } from './alias-links-response.dto';
import { AliasResponseDto } from './alias-response.dto';

export class AliasPageResponseDto extends PageResponseDto {
  constructor(init?: Partial<AliasPageResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty((e) => new AliasLinksResponseDto().buildAll(e))
  items: AliasResponseDto[] = [];
}
