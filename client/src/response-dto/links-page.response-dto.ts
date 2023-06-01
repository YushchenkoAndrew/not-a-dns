import { ResponseProperty } from '../decorators/response-property';
import { LinksEntity } from '../entities/links.entity';
import { CommonPageResponseDto } from './common-page.response-dto';
import { CommonResponseDto } from './common.response-dto';

export class LinksPageResponseDto extends CommonPageResponseDto {
  constructor(init?: Partial<LinksPageResponseDto>) {
    super();
    CommonResponseDto.assign(init, this);
  }

  @ResponseProperty({ type: LinksEntity, isArray: true })
  items: LinksEntity[];
}
