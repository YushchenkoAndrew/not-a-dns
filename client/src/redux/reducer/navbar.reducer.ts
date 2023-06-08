import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AliasPageEntity } from '../../entities/alias/alias-page.entity';
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
    addFavorite: (state, action: PayloadAction<AliasPageEntity>) => {
      // state.items.push(...action.payload.items);
    },

    deleteFavorite: (state, action: PayloadAction<AliasPageEntity>) => {
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
