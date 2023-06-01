import { ResponseProperty } from '../decorators/response-property';
import { AliasEntity } from './alias.entity';
import { CommonEntity } from './common.entity';

export class LinksEntity extends CommonEntity {
  @ResponseProperty()
  favorite: boolean = false;

  @ResponseProperty()
  from: string = '';

  @ResponseProperty()
  to: string = '';

  @ResponseProperty({ recursive: true })
  relations: (AliasEntity | LinksEntity)[] = [];
}
