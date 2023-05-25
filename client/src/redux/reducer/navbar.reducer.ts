import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NavBarItemProps } from '../../components/NavBar/NavBarItem';
import { NavbarSettingResponseDto } from '../../response-dto/setting/navbar-setting.response-dto';
import { preloadNavbar } from '../thunk/navbar.thunk';

type NavbarStoreT = NavbarSettingResponseDto;

export const navbarStore = createSlice({
  name: 'navbar',
  initialState: {
    items: [] as NavBarItemProps[],
  } as NavbarStoreT,
  reducers: {
    addFavorite: (state, action: PayloadAction<NavBarItemProps>) => {
      state.items.push(action.payload);
    },

    deleteFavorite: (state, action: PayloadAction<NavBarItemProps>) => {
      state.items.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(preloadNavbar.fulfilled, (state, { payload }) => {
      state.items = payload.items;
    });
  },
});
