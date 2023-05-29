import { EntityProperty } from '../decorators/entity-property';
import { CommonEntity } from './common.entity';

export class AliasEntity extends CommonEntity {
  @EntityProperty()
  id: string;

  @EntityProperty()
  favorite: boolean = false;

  @EntityProperty()
  name: string = '';

  @EntityProperty()
  value: string = '';

  @EntityProperty()
  used_in: number;
}
