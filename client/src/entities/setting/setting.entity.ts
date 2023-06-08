import { RequestEntity } from '../../decorators/request-entity';
import { ResponseProperty } from '../../decorators/response-property';
import { CommonEntity } from '../common.entity';

@RequestEntity({
  route: 'setting',
  id: 'default',
  action: { findOne: 'general/preload', save: 'general/save' },
})
export class SettingEntity extends CommonEntity {
  constructor(init?: Partial<SettingEntity>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty()
  id: string;

  @ResponseProperty()
  name: string;

  @ResponseProperty()
  mode: boolean;
}
