import { Column, Request } from '../../decorators/column';
import { CommonEntity } from '../common.entity';
import { LinksResponseDto } from '../links/links-response.dto';
import { AliasEntity } from './alias.entity';

export class AliasLinksEntity extends CommonEntity {
  @Column((e) => new AliasEntity().buildAll(e.alias))
  @Request((e) => e.alias?.map((e) => e.id) ?? [])
  alias: AliasEntity[];

  @Column((e) => new LinksResponseDto().buildAll(e.links))
  @Request((e) => e.links?.map((e) => e.id) ?? [])
  links: LinksResponseDto[];
}
