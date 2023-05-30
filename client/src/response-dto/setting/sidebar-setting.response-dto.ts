import { ResponseProperty } from '../../decorators/response-property';
import { CommonResponseDto } from '../common.response-dto';

export type NavBarItemT = {
  name: string;
  icon?: string;
  anchor: string;

  chapters?: NavBarItemT[];
};

export class SidebarSettingResponseDto extends CommonResponseDto {
  constructor(init?: Partial<SidebarSettingResponseDto>) {
    super();
    CommonResponseDto.assign(init, this);
  }

  @ResponseProperty()
  items: NavBarItemT[] = [];
}
