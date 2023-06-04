import { AfterLoad, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { IdEntity } from '../../common/common.entity';
import { LinksEntity } from '../../links/entities/links.entity';
import { LinkableTypeEnum } from '../types/linkable-type.enum';
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

  /**
   * @see {@link LinkableTypeEnum}
   */
  @Column({ type: 'integer', nullable: true })
  linkable_type: number; // LinkableTypeEnum

  /**
   * Not the best solution because it will load every
   * possible relation, but i guess it just works
   *
   * @see {@link afterLoad}, where I just make variable nullable
   * if it has incorrect {@link linkable_type}
   */
  @OneToOne(() => LinksEntity, { nullable: true })
  @JoinColumn({ name: 'linkable_id' })
  linkable_links: LinksEntity;

  /**
   * Not the best solution because it will load every
   * possible relation, but i guess it just works
   *
   * @see {@link afterLoad}, where I just make variable nullable
   * if it has incorrect {@link linkable_type}
   */
  @OneToOne(() => AliasEntity, { nullable: true })
  @JoinColumn({ name: 'linkable_id' })
  linkable_alias: AliasEntity;

  /**
   * For more info check out
   * @see {@link linkable_links}
   * @see {@link linkable_alias}
   */
  @AfterLoad()
  async afterLoad() {
    if (this.linkable_type != LinkableTypeEnum.links) {
      this.linkable_links = null;
    }

    if (this.linkable_type != LinkableTypeEnum.alias) {
      this.linkable_alias = null;
    }
  }
}
