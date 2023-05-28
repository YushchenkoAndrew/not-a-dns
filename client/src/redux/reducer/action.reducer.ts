import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ObjectLiteral } from '../../types';
import { ActionTypes } from '../../types/action.types';

export type ActionOptions = { type: (typeof ActionTypes)[number] } & Partial<{
  id: string;
  isFavorite: boolean;
  required: string[];
}>;

type ActionT = {
  options: ActionOptions;

  data: ObjectLiteral;
};

export const actionStore = createSlice({
  name: 'action',
  initialState: {
    options: { type: null },
    data: null,
  } as ActionT,
  reducers: {
    onSelect: (state, { payload }: PayloadAction<ObjectLiteral>) => {
      // FIXME:
      state.options.type = 'host';
      state.data = { ...payload };
    },
    onUpdate: (
      state,
      { payload }: PayloadAction<{ name: string; value: string }>,
    ) => {
      state.data[payload.name] = payload.value;
    },

    toggleFavorite: (state) => {
      state.options.isFavorite = !state.options.isFavorite;
    },

    unfocus: (state) => {
      state.options = { type: null };
      state.data = null;
    },
  },
  extraReducers(builder) {
    // builder.addCase(preloadGeneral.fulfilled, (state, { payload }) => {
    //   state.loaded = true;
    //   if (payload.mode) state.mode = payload.mode;
    // });
  },
});
