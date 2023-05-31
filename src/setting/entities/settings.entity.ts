import { Column, Entity } from 'typeorm';

import { NanoidEntity } from '../../common/common.entity';

@Entity({ name: 'settings' })
export class SettingsEntity extends NanoidEntity {
  @Column({ type: 'boolean', nullable: false })
  mode: boolean;
}
