import {
  CipherGCM,
  createCipheriv,
  createDecipheriv,
  DecipherGCM,
  randomBytes,
  scryptSync,
} from 'crypto';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

import { NanoidEntity } from '../../common/common.entity';
import { Config } from '../../config';

@Entity({ name: 'secrets' })
export class SecretEntity extends NanoidEntity {
  @Column({ type: 'text', nullable: false })
  algorithm: string;

  @Column({ type: 'text', nullable: false })
  salt: string;

  @Column({ type: 'text', nullable: false })
  iv: string;

  @Column({ type: 'text', nullable: true })
  auth_tag: string;

  @Column({ type: 'text', nullable: false })
  value: string;

  is_encrypted: boolean;

  @AfterLoad()
  async afterLoad() {
    this.is_encrypted ??= true;
    if (!this.is_encrypted) return;

    const salt = Buffer.from(this.salt, 'hex');
    const iv = Buffer.from(this.iv, 'hex');

    const key = scryptSync(Config.self.dynamic.secret, salt, 32);
    const authTag = this.auth_tag ? Buffer.from(this.auth_tag, 'hex') : null;

    if (!authTag) throw new Error('Not supported');
    const decipher = (
      createDecipheriv(this.algorithm, key, iv) as DecipherGCM
    ).setAuthTag(authTag);

    this.is_encrypted = false;
    this.value = Buffer.concat([
      decipher.update(Buffer.from(this.value, 'hex')),
      decipher.final(),
    ]).toString('utf-8');
  }

  @BeforeInsert()
  async beforeInsert() {
    super.beforeInsert();
    if (this.is_encrypted) return;

    // TODO: Make algorithm random
    this.algorithm = 'aes-256-gcm';

    const iv = randomBytes(16);
    const salt = randomBytes(32);

    const key = scryptSync(Config.self.dynamic.secret, salt, 32);
    const cipher = createCipheriv(this.algorithm, key, iv) as CipherGCM;

    this.salt = salt.toString('hex');
    this.iv = iv.toString('hex');

    this.is_encrypted = true;
    this.value = Buffer.concat([
      cipher.update(this.value),
      cipher.final(),
    ]).toString('hex');

    this.auth_tag = cipher.getAuthTag().toString('hex') || null;
  }

  @BeforeUpdate()
  async beforeUpdate() {
    super.beforeUpdate();
    if (this.is_encrypted) return;

    const salt = Buffer.from(this.salt, 'hex');
    const iv = Buffer.from(this.iv, 'hex');

    const key = scryptSync(Config.self.dynamic.secret, salt, 32);
    const cipher = createCipheriv(this.algorithm, key, iv) as CipherGCM;

    this.is_encrypted = true;
    this.value = Buffer.concat([
      cipher.update(this.value),
      cipher.final(),
    ]).toString('hex');

    this.auth_tag = cipher.getAuthTag().toString('hex') || null;
  }
}
