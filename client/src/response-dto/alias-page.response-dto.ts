import { ResponseProperty } from '../decorators/response-property';
import { AliasEntity } from '../entities/alias.entity';
import { CommonPageResponseDto } from './common-page.response-dto';
import { CommonResponseDto } from './common.response-dto';

export class AliasPageResponseDto extends CommonPageResponseDto {
  constructor(init?: Partial<AliasPageResponseDto>) {
    super();
    CommonResponseDto.assign(init, this);
  }

  @ResponseProperty({ type: [AliasEntity] })
  items: AliasEntity[];
}
