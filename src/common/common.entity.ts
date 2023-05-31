import { customAlphabet, urlAlphabet } from 'nanoid';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class IdEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: string;
}

export class TimestampedEntity extends IdEntity {
  @CreateDateColumn({ type: 'datetime', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updated_at: Date;

  @BeforeInsert()
  async beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.updated_at = new Date();
  }
}

export class NanoidEntity extends TimestampedEntity {
  @Column({ type: 'text', nullable: false })
  nanoid: string;

  @BeforeInsert()
  async beforeInsert() {
    super.beforeInsert();

    if (this.nanoid) return;
    this.nanoid = customAlphabet(urlAlphabet, 10)();
  }
}
