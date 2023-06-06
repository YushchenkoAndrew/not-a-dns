import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { NanoidEntity } from '../../common/common.entity';
import { SecretEntity } from '../../secret/entities/secret.entity';
import { AliasLinksEntity } from './alias-links.entity';

@Entity({ name: 'alias' })
export class AliasEntity extends NanoidEntity {
  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: false })
  alias: string;

  @Column({ type: 'text', nullable: true })
  value: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  favorite: boolean;

  @OneToOne(() => SecretEntity, { nullable: true })
  @JoinColumn({ name: 'secret_id' })
  secret: SecretEntity;

  @Column({ type: 'integer', nullable: true })
  secret_id: number;

  @OneToMany(() => AliasLinksEntity, (e) => e.alias)
  alias_link: AliasLinksEntity[];

  children: AliasEntity[];
  parent: AliasEntity[];

  @AfterLoad()
  afterLoad() {
    this.secret?.afterLoad();
    this.alias_link?.forEach((item) => item?.afterLoad());
  }

  unwrap(e: AliasEntity = this) {
    if (!e.parent?.length) return e.value || e.secret?.value || '';

    return (e.value = e.parent.reduce(
      (acc, alias) =>
        acc.replace(
          new RegExp(`{{ ${alias.alias} }}`, 'g'),
          this.unwrap(alias),
        ),
      e.value || e.secret?.value || '',
    ));
  }
}
