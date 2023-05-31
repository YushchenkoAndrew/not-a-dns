import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { IdEntity } from '../../common/common.entity';
import { AliasEntity } from './alias.entity';

@Entity({ name: 'alias_links' })
export class AliasLinksEntity extends IdEntity {
  @OneToOne(() => AliasEntity, { nullable: true })
  @JoinColumn({ name: 'alias_id' })
  alias: AliasEntity;

  @Column({ type: 'integer', nullable: true })
  alias_id: number;

  @Column({ type: 'integer', nullable: true })
  linkable_id: number;

  @Column({ type: 'integer', nullable: true })
  linkable_type: number; // LinkableTypeEnum
}
