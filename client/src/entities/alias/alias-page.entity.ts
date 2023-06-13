import { Entity } from '../../decorators/request-entity';
import { Column } from '../../decorators/column';
import { CommonPageEntity } from '../common-page.entity';
import { AliasEntity } from './alias.entity';

@Entity({ route: 'alias', action: { select: 'alias/load' } })
export class AliasPageEntity extends CommonPageEntity {
  @Column((e) => new AliasEntity().buildAll(e.items))
  items: AliasEntity[];
}
