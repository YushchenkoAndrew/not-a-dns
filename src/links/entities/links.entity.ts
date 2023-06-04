import { Column, Entity } from 'typeorm';

import { NanoidEntity } from '../../common/common.entity';

@Entity({ name: 'links' })
export class LinksEntity extends NanoidEntity {
  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  url: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  favorite: boolean;
}
