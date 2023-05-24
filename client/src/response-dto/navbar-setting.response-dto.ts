import { NavBarItemProps } from '../components/NavBar/NavBarItem';
import { CommonResponseDto } from './common.response-dto';

export class NavbarSettingResponseDto extends CommonResponseDto {
  constructor(init?: Partial<NavbarSettingResponseDto>) {
    super();
    this.assign(init, this);
  }

  items: NavBarItemProps[];
}
