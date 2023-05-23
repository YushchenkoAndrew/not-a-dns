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
      { name: 'General', icon: 'gear', anchor: 'general' },
      { name: 'records', anchor: 'records', chapter_id: 'temp#id1' },
    ] as SideBarItemsT[],

    chapters: {
      'temp#id1': [
        { name: 'A Records', icon: 'circle', anchor: 'a_record' },
        { name: 'AAAA Records', icon: 'circle', anchor: '' },
        { name: 'CNAME Records', icon: 'circle', anchor: '' },
        { name: 'PTR Records', icon: 'circle', anchor: '' },
        { name: 'MX Records', icon: 'circle', anchor: '' },
        { name: 'TXT Records', icon: 'circle', anchor: '' },
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
