import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SideBarChapterProps } from '../../components/SideBar/SideBarChapter.';
import { SideBarItemProps } from '../../components/SideBar/SideBarItem';
import { ObjectLiteral } from '../../types';

type SideBarItemsT = SideBarChapterProps | SideBarItemProps;

export const isSideBarChapter = (
  props: SideBarItemsT,
): props is SideBarChapterProps =>
  (<SideBarChapterProps>props).chapter_id !== undefined;

export const sidebarStore = createSlice({
  name: 'sidebar',
  initialState: {
    section: window.location.hash?.slice(1) || 'general',
    items: [
      { name: 'General' },
      { name: 'records', chapter_id: 'temp#id1' },
    ] as SideBarItemsT[],

    chapters: {
      'temp#id1': [
        { name: 'A Records' },
        { name: 'AAAA Records' },
        { name: 'CNAME Records' },
        { name: 'PTR Records' },
        { name: 'MX Records' },
        { name: 'TXT Records' },
      ],
    } as ObjectLiteral<SideBarItemsT[]>,
  },
  reducers: {
    setSection: (state, action: PayloadAction<string>) => {
      state.section = action.payload;
    },

    // deleteFavorite: (state, action: PayloadAction<NavBarItemProps>) => {
    //   state.items.push(action.payload);
    // },
  },
});
