import { ResponseProperty } from '../../common/decorators/response-property';
import { PageResponseDto } from '../../common/response-dto/page-response.dto';
import { LinksResponseDto } from './links-response.dto';

export class LinksPageResponseDto extends PageResponseDto {
  constructor(init?: Partial<LinksPageResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty((e) => new LinksResponseDto().buildAll(e))
  items: LinksResponseDto[];
}
