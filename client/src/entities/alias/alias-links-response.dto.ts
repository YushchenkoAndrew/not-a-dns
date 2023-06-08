import { ResponseProperty } from '../../decorators/response-property';
import { CommonEntity } from '../common.entity';
import { LinksResponseDto } from '../links/links-response.dto';
import { AliasEntity } from './alias.entity';

export class AliasLinksResponseDto extends CommonEntity {
  @ResponseProperty((e) => new AliasEntity().buildAll(e.alias))
  alias: AliasEntity[];

  @ResponseProperty((e) => new LinksResponseDto().buildAll(e.links))
  links: LinksResponseDto[];
}
