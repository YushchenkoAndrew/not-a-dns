import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AliasPageResponseDto } from '../../response-dto/alias/alias-page-response.dto';
import { AliasResponseDto } from '../../response-dto/alias/alias-response.dto';
import { preloadNavbar } from '../thunk/navbar.thunk';

type NavbarStoreT = {
  items: AliasResponseDto[];
};

export const navbarStore = createSlice({
  name: 'navbar',
  initialState: {
    items: [] as AliasResponseDto[],
  } as NavbarStoreT,
  reducers: {
    addFavorite: (state, action: PayloadAction<AliasPageResponseDto>) => {
      // state.items.push(...action.payload.items);
    },

    deleteFavorite: (state, action: PayloadAction<AliasPageResponseDto>) => {
      // TODO:
      // state.items.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(preloadNavbar.fulfilled, (state, { payload }) => {
      state.items = payload.items;
    });
  },
});
