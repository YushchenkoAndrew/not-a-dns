import { ResponseProperty } from '../decorators/response-property';
import { CommonResponseDto } from './common.response-dto';

export abstract class CommonPageResponseDto extends CommonResponseDto {
  @ResponseProperty()
  page: number;

  @ResponseProperty()
  total: number;

  @ResponseProperty()
  abstract items: unknown[];
}
