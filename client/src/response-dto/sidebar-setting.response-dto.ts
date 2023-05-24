import { SideBarChapterProps } from '../components/SideBar/SideBarChapter.';
import { SideBarItemProps } from '../components/SideBar/SideBarItem';
import { ObjectLiteral } from '../types';
import { CommonResponseDto } from './common.response-dto';

export class SidebarSettingResponseDto extends CommonResponseDto {
  constructor(init?: Partial<SidebarSettingResponseDto>) {
    super();
    this.assign(init, this);
  }

  items: (SideBarItemProps | SideBarChapterProps)[];
  chapters: ObjectLiteral<(SideBarItemProps | SideBarChapterProps)[]>;
}
