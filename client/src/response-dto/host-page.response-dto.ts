import { ResponseProperty } from '../decorators/response-property';
import { CommonPageResponseDto } from './common-page.response-dto';

type HostItem = {
  id: string;
  alias: string;
  ip: string;
  port: number;
};

export class HostPageResponseDto extends CommonPageResponseDto {
  constructor(init?: Partial<HostPageResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty()
  items: HostItem[];
}
