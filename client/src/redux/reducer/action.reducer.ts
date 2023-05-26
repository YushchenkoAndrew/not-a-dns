import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CommonEntity } from '../../entities/common.entity';

type ActionT = {
  selected: CommonEntity;
};

export const actionStore = createSlice({
  name: 'action',
  initialState: {
    selected: null,
  } as ActionT,
  reducers: {
    onSelect: (state, { payload }: PayloadAction<CommonEntity>) => {
      state.selected = payload;
      console.log(payload);
    },
  },
  extraReducers(builder) {
    // builder.addCase(preloadGeneral.fulfilled, (state, { payload }) => {
    //   state.loaded = true;
    //   if (payload.mode) state.mode = payload.mode;
    // });
  },
});
