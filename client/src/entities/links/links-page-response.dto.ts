import { ResponseProperty } from '../../decorators/response-property';
import { CommonPageEntity } from '../common-page.entity';
import { LinksResponseDto } from './links-response.dto';

export class LinksPageResponseDto extends CommonPageEntity {
  @ResponseProperty((e) => new LinksResponseDto().buildAll(e.items))
  items: LinksResponseDto[];
}
