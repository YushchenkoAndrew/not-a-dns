import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { NanoidEntity } from '../../common/common.entity';
import { SecretEntity } from '../../user/entities/secret.entity';
import { AliasLinksEntity } from './alias-links.entity';

@Entity({ name: 'alias' })
export class AliasEntity extends NanoidEntity {
  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  value: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  favorite: boolean;

  @OneToOne(() => SecretEntity, { nullable: true })
  @JoinColumn({ name: 'secret_id' })
  secret: SecretEntity;

  @OneToMany(() => AliasLinksEntity, (e) => e.alias)
  alias_link: AliasLinksEntity[];

  alias: AliasEntity[];
}
