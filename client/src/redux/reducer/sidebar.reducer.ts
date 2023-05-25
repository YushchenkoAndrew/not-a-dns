import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import { SideBarChapterProps } from '../../components/SideBar/SideBarChapter.';
import { SideBarItemProps } from '../../components/SideBar/SideBarItem';
import { NavBarItemT } from '../../response-dto/setting/sidebar-setting.response-dto';
import { ObjectLiteral } from '../../types';
import { preloadSidebar } from '../thunk/sidebar.thunk';

export const isSideBarChapter = (
  props: SideBarChapterProps | SideBarItemProps,
): props is SideBarChapterProps =>
  (<SideBarChapterProps>props).chapter_id !== undefined;

type SideBarStoreT = {
  items: (SideBarItemProps | SideBarChapterProps)[];

  chapters: ObjectLiteral<(SideBarItemProps | SideBarChapterProps)[]>;
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
    setSection: (state, action: PayloadAction<string>) => {
      state.section = action.payload;
    },

    // deleteFavorite: (state, action: PayloadAction<NavBarItemProps>) => {
    //   state.items.push(action.payload);
    // },
  },

  extraReducers(builder) {
    builder.addCase(preloadSidebar.fulfilled, (state, { payload }) => {
      for (const { name, anchor, icon, chapters } of payload.items) {
        const chapter_id = chapters && nanoid();
        state.items.push({ name, anchor, icon, chapter_id });

        if (!chapter_id) continue;
        (function unwrap(id: string, items: NavBarItemT[]) {
          state.chapters[id] = [];
          for (const { name, anchor, icon, chapters } of items) {
            const chapter_id = chapters && nanoid();
            state.chapters[id].push({ name, anchor, icon, chapter_id });

            if (!chapter_id) continue;
            unwrap(chapter_id, chapters);
          }
        })(chapter_id, chapters);
      }
    });
  },
});
