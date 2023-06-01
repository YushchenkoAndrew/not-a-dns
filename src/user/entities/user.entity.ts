import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { NanoidEntity } from '../../common/common.entity';
import { SecretEntity } from './secret.entity';

@Entity({ name: 'users' })
export class UsersEntity extends NanoidEntity {
  @Column({ type: 'text', nullable: false })
  name: string;

  @OneToOne(() => SecretEntity, { nullable: false })
  @JoinColumn({ name: 'secret_id' })
  secret: SecretEntity;
}
