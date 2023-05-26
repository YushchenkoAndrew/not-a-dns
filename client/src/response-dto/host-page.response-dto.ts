import { ResponseProperty } from '../decorators/response-property';
import { HostEntity } from '../entities/host.entity';
import { CommonPageResponseDto } from './common-page.response-dto';

export class HostPageResponseDto extends CommonPageResponseDto {
  constructor(init?: Partial<HostPageResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty()
  items: HostEntity[];
}
