import { ResponseProperty } from '../decorators/response-property';
import { CommonResponseDto } from './common-response.dto';

export abstract class PageResponseDto extends CommonResponseDto {
  @ResponseProperty()
  page: number = 1;

  @ResponseProperty()
  per_page: number = 30;

  @ResponseProperty()
  total: number = 0;

  @ResponseProperty()
  abstract items: unknown[];
}
