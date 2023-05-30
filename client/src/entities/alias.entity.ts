import { ResponseProperty } from '../decorators/response-property';
import { CommonEntity } from './common.entity';
import { LinksEntity } from './links.entity';

export class AliasEntity extends CommonEntity {
  @ResponseProperty()
  favorite: boolean = false;

  @ResponseProperty()
  name: string = '';

  @ResponseProperty()
  value: string = '';

  @ResponseProperty()
  relations: (AliasEntity | LinksEntity)[] = [];
}
