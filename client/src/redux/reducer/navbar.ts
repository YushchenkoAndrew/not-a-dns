import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NavBarItemProps } from '../../components/NavBar/NavBarItem';
import { NavbarSettingResponseDto } from '../../response-dto/navbar-setting.response-dto';

type NavbarStoreT = NavbarSettingResponseDto;

export const navbarStore = createSlice({
  name: 'navbar',
  initialState: {
    items: [] as NavBarItemProps[],
  } as NavbarStoreT,
  reducers: {
    init(state, { payload }: PayloadAction<Partial<NavbarStoreT>>) {
      if (payload.items) state.items = payload.items;
    },

    addFavorite: (state, action: PayloadAction<NavBarItemProps>) => {
      state.items.push(action.payload);
    },

    deleteFavorite: (state, action: PayloadAction<NavBarItemProps>) => {
      state.items.push(action.payload);
    },
  },
});
