import { Column, Entity } from 'typeorm';
import { AliasLinksEntity } from '../../alias/entities/alias-links.entity';

import { NanoidEntity } from '../../common/common.entity';

@Entity({ name: 'links' })
export class LinksEntity extends NanoidEntity {
  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  url: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  favorite: boolean;

  alias_link: AliasLinksEntity[];

  unwrap(e: LinksEntity = this) {
    if (!e.alias_link?.length) return e.url || '';

    return (e.url = e.alias_link.reduce(
      (acc, { alias }) =>
        acc.replace(new RegExp(`{{ ${alias.alias} }}`, 'g'), alias.unwrap()),
      e.url || '',
    ));
  }
}
