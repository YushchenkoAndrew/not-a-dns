import { Entity } from '../../decorators/request-entity';
import { Column } from '../../decorators/column';
import { CommonEntity } from '../common.entity';

@Entity({
  route: 'setting',
  id: 'default',
  action: { findOne: 'general/preload', save: 'general/save' },
})
export class SettingEntity extends CommonEntity {
  constructor(init?: Partial<SettingEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  id: string;

  @Column()
  name: string;

  @Column()
  mode: boolean;
}
