import { ResponseProperty } from '../../decorators/response-property';
import { CommonPageResponseDto } from '../common-page.response-dto';
import { AliasResponseDto } from './alias-response.dto';

export class AliasPageResponseDto extends CommonPageResponseDto {
  @ResponseProperty((e) => new AliasResponseDto().buildAll(e.items))
  items: AliasResponseDto[];
}
