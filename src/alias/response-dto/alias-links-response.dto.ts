import { ResponseProperty } from '../../common/decorators/response-property';
import { CommonResponseDto } from '../../common/response-dto/common-response.dto';
import { AliasResponseDto } from './alias-response.dto';

export class AliasLinksResponseDto extends CommonResponseDto {
  @ResponseProperty((e) => new AliasResponseDto().buildAll(e.alias))
  alias: AliasResponseDto[] = [];

  // TODO:
  // @ResponseProperty((e) => new AliasResponseDto().buildAll(e.alias))
  // links: AliasResponseDto[] = [];
}
