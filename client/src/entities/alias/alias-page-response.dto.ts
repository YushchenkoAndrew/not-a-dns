import { ResponseProperty } from '../../decorators/response-property';
import { CommonPageResponseDto } from '../common-page.response-dto';
import { AliasEntity } from './alias.entity';

export class AliasPageResponseDto extends CommonPageResponseDto {
  @ResponseProperty((e) => new AliasEntity().buildAll(e.items))
  items: AliasEntity[];
}
