import { ResponseProperty } from '../../common/decorators/response-property';
import { CommonResponseDto } from '../../common/response-dto/common-response.dto';
import { LinksResponseDto } from '../../links/response-dto/links-response.dto';
import { AliasResponseDto } from './alias-response.dto';

export class AliasLinksResponseDto extends CommonResponseDto {
  constructor(init?: Partial<AliasLinksResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty((e) => [])
  alias: AliasResponseDto[] = [];

  @ResponseProperty((e) => [])
  links: LinksResponseDto[] = [];
}
