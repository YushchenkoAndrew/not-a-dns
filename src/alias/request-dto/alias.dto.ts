import { Optional } from '@nestjs/common';

import { PageDto } from '../../common/request-dto/page.dto';

export class AliasDto extends PageDto {
  @Optional()
  query: string;
}
