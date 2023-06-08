import { ResponseProperty } from '../../decorators/response-property';
import { CommonEntity } from '../common.entity';

export class LinksResponseDto extends CommonEntity {
  @ResponseProperty()
  favorite: boolean = false;

  // @ResponseProperty()
  from: string = '';

  // @ResponseProperty()
  to: string = '';
  id: any = '';

  // @ResponseProperty({ recursive: true })
  relations: any[] = [];
}
