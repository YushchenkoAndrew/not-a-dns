import { ResponseProperty } from '../../decorators/response-property';
import { CommonResponseDto } from '../common.response-dto';

export class LinksResponseDto extends CommonResponseDto {
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
