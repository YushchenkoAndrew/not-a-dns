import { ResponseProperty } from '../../decorators/response-property';
import { CommonResponseDto } from '../common.response-dto';
import { LinksResponseDto } from '../links/links-response.dto';
import { AliasResponseDto } from './alias-response.dto';

export class AliasLinksResponseDto extends CommonResponseDto {
  @ResponseProperty((e) => new AliasResponseDto().buildAll(e.alias))
  alias: AliasResponseDto[];

  @ResponseProperty((e) => new LinksResponseDto().buildAll(e.links))
  links: LinksResponseDto[];
}
