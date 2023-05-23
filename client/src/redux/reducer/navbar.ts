import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NavBarItemProps } from '../../components/NavBar/NavBarItem';

export const navbarStore = createSlice({
  name: 'navbar',
  initialState: {
    items: [
      { name: '/mortis-greamreaper', href: 'home', target: '_blank' },
      { name: '/grape', href: 'test', target: '_blank' },
      { name: '/void', href: 't', target: '_blank' },
      { name: '/botodachi', href: 't', target: '_blank' },
    ] as NavBarItemProps[],
  },
  reducers: {
    addFavorite: (state, action: PayloadAction<NavBarItemProps>) => {
      state.items.push(action.payload);
    },

    deleteFavorite: (state, action: PayloadAction<NavBarItemProps>) => {
      state.items.push(action.payload);
    },
  },
});
