import { ResponseProperty } from '../decorators/response-property';
import { AliasEntity } from './alias.entity';
import { CommonEntity } from './common.entity';

export class LinksEntity extends CommonEntity {
  @ResponseProperty()
  favorite: boolean = false;

  @ResponseProperty()
  name: string = '';

  @ResponseProperty()
  from: string = '';

  @ResponseProperty()
  to: string = '';

  @ResponseProperty()
  relations: (AliasEntity | LinksEntity)[] = [];
}
