import { Column, Entity } from 'typeorm';

import { NanoidEntity } from '../../common/common.entity';

@Entity({ name: 'alias' })
export class AliasEntity extends NanoidEntity {
  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  value: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  favorite: boolean;
}
