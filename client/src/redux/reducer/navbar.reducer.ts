import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AliasPageResponseDto } from '../../entities/alias/alias-page-response.dto';
import { AliasEntity } from '../../entities/alias/alias.entity';
import { preloadNavbar } from '../thunk/navbar.thunk';

type NavbarStoreT = {
  items: AliasEntity[];
};

export const navbarStore = createSlice({
  name: 'navbar',
  initialState: {
    items: [] as AliasEntity[],
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
