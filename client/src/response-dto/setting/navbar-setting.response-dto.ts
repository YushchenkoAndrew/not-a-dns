import { NavBarItemProps } from '../../components/NavBar/NavBarItem';
import { ResponseProperty } from '../../decorators/response-property';
import { CommonResponseDto } from '../common.response-dto';

export class NavbarSettingResponseDto extends CommonResponseDto {
  constructor(init?: Partial<NavbarSettingResponseDto>) {
    super();
    CommonResponseDto.assign(init, this);
  }

  @ResponseProperty()
  items: NavBarItemProps[] = [];
}
