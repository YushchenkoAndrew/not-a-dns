import { RequestEntity } from '../../decorators/request-entity';
import { ResponseProperty } from '../../decorators/response-property';
import { CommonPageEntity } from '../common-page.entity';
import { AliasEntity } from './alias.entity';

@RequestEntity({ route: 'alias', action: { select: 'alias/load' } })
export class AliasPageEntity extends CommonPageEntity {
  @ResponseProperty((e) => new AliasEntity().buildAll(e.items))
  items: AliasEntity[];
}
