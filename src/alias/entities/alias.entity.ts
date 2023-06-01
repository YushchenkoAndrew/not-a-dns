import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { NanoidEntity } from '../../common/common.entity';
import { SecretEntity } from '../../user/entities/secret.entity';

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
}
