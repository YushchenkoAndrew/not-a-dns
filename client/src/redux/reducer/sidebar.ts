import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SideBarChapterProps } from '../../components/SideBar/SideBarChapter.';
import { SideBarItemProps } from '../../components/SideBar/SideBarItem';
import { SidebarSettingResponseDto } from '../../response-dto/sidebar-setting.response-dto';

export const isSideBarChapter = (
  props: SideBarChapterProps | SideBarItemProps,
): props is SideBarChapterProps =>
  (<SideBarChapterProps>props).chapter_id !== undefined;

type SideBarStoreT = SidebarSettingResponseDto & {
  section: string;
};

export const sidebarStore = createSlice({
  name: 'sidebar',
  initialState: {
    section: window.location.hash?.slice(1) || 'general',
    items: [],
    chapters: {},
  } as SideBarStoreT,

  reducers: {
    init(state, { payload }: PayloadAction<Partial<SideBarStoreT>>) {
      if (payload.items) state.items = payload.items;
      if (payload.chapters) state.chapters = payload.chapters;
    },

    setSection: (state, action: PayloadAction<string>) => {
      state.section = action.payload;
    },

    // deleteFavorite: (state, action: PayloadAction<NavBarItemProps>) => {
    //   state.items.push(action.payload);
    // },
  },
});
