import { SideBarChapterProps } from '../components/SideBar/SideBarChapter.';
import { SideBarItemProps } from '../components/SideBar/SideBarItem';
import { ResponseProperty } from '../decorators/response-property';
import { CommonResponseDto } from './common.response-dto';

import type { ObjectLiteral } from '../types';
export class SidebarSettingResponseDto extends CommonResponseDto {
  constructor(init?: Partial<SidebarSettingResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty()
  items: (SideBarItemProps | SideBarChapterProps)[];

  @ResponseProperty()
  chapters: ObjectLiteral<(SideBarItemProps | SideBarChapterProps)[]>;
}
