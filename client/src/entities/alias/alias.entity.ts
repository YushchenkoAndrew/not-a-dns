import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { ColumnProperty } from '../../decorators/column-property';
import { RequestEntity } from '../../decorators/request-entity';
import { ResponseProperty } from '../../decorators/response-property';
import { CommonEntity } from '../common.entity';
import { AliasLinksEntity } from './alias-links.entity';

@RequestEntity({ route: 'alias' })
export class AliasEntity extends CommonEntity {
  constructor(init?: Partial<AliasEntity>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty()
  id: string;

  @ResponseProperty()
  updated_at: string;

  @ResponseProperty({ default: '' })
  @ColumnProperty({ index: 2, className: 'w-min' })
  name: string;

  @ResponseProperty()
  @ColumnProperty({ index: 3, className: 'w-min', required: true })
  alias: string;

  @ResponseProperty()
  @ColumnProperty({ index: 4, className: 'w-min', required: true })
  value: string;

  @ResponseProperty()
  @ColumnProperty({
    index: 1,
    className: 'w-min',
    icon: { true: faStar, false: farStar },
  })
  favorite: boolean;

  @ResponseProperty()
  @ColumnProperty({ hidden: true })
  secrete: boolean;

  @ResponseProperty((e) => new AliasLinksEntity().build(e.children ?? {}))
  @ColumnProperty({ hidden: true, related: true })
  children: AliasLinksEntity;

  @ResponseProperty((e) => new AliasLinksEntity().build(e.parent ?? {}))
  @ColumnProperty({ hidden: true, related: true })
  parent: AliasLinksEntity;
}
