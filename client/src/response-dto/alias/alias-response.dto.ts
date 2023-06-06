import { ResponseProperty } from '../../decorators/response-property';
import { CommonResponseDto } from '../common.response-dto';
import { AliasLinksResponseDto } from './alias-links-response.dto';

export class AliasResponseDto extends CommonResponseDto {
  @ResponseProperty()
  id: string;

  @ResponseProperty({ default: '' })
  name: string;

  @ResponseProperty()
  alias: string;

  @ResponseProperty()
  value: string;

  @ResponseProperty()
  favorite: boolean;

  @ResponseProperty()
  secrete: boolean;

  @ResponseProperty((e) => new AliasLinksResponseDto().build(e.children))
  children: AliasLinksResponseDto;

  @ResponseProperty((e) => new AliasLinksResponseDto().build(e.parent))
  parent: AliasLinksResponseDto;
}
