import { ResponseProperty } from '../../decorators/response-property';
import { CommonPageResponseDto } from '../common-page.response-dto';
import { LinksResponseDto } from './links-response.dto';

export class LinksPageResponseDto extends CommonPageResponseDto {
  @ResponseProperty((e) => new LinksResponseDto().buildAll(e.items))
  items: LinksResponseDto[];
}
