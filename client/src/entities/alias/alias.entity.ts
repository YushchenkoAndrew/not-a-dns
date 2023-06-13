import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Property } from '../../decorators/property';
import { Entity } from '../../decorators/request-entity';
import { Column, Request } from '../../decorators/column';
import { CommonEntity } from '../common.entity';
import { AliasLinksEntity } from './alias-links.entity';

@Entity({ route: 'alias' })
export class AliasEntity extends CommonEntity {
  constructor(init?: Partial<AliasEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  id: string;

  @Column()
  updated_at: string;

  @Column({ default: '' })
  @Property({ index: 2, className: 'w-min' })
  name: string;

  @Column()
  @Property({ index: 3, className: 'w-min', required: true })
  alias: string;

  @Column()
  @Property({ index: 4, className: 'w-min', required: true })
  value: string;

  @Column()
  @Property({
    index: 1,
    className: 'w-min',
    icon: { true: faStar, false: farStar },
  })
  favorite: boolean;

  @Column()
  @Property({ hidden: true })
  secrete: boolean;

  @Property({ hidden: true, related: true })
  @Column((e) => new AliasLinksEntity().build(e.children ?? {}))
  @Request(() => undefined)
  children: AliasLinksEntity;

  @Property({ hidden: true, related: true })
  @Column((e) => new AliasLinksEntity().build(e.parent ?? {}))
  @Request((e) => new AliasLinksEntity().build(e.children ?? {}, true))
  parent: AliasLinksEntity;
}
