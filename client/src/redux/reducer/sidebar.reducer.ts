import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import { SideBarChapterProps } from '../../components/SideBar/SideBarChapter.';
import { SideBarItemProps } from '../../components/SideBar/SideBarItem';
import { ObjectService } from '../../lib';
import { AliasResponseDto } from '../../response-dto/alias/alias-response.dto';
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
      console.log('FIXME: Sidebar');

      for (const k of ObjectService.keys(payload)) {
        const chapter_id = nanoid();
        state.items.push({ name: k, anchor: k, chapter_id });

        // FIXME: Fix logic of this
        (function unwrap(parent_id: string, items: AliasResponseDto[]) {
          state.chapters[parent_id] = [];
          for (const { id, alias: name, children } of items) {
            // const chapter_id = children?.alias?.length ? nanoid() : null;
            // state.chapters[parent_id].push({ name, anchor: id, chapter_id });
            state.chapters[parent_id].push({ name, anchor: id });

            // if (!chapter_id) continue;
            // unwrap(chapter_id, children.alias);
          }
        })(chapter_id, payload[k].items);
      }
    });
  },
});
