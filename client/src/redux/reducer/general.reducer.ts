import { createSlice } from '@reduxjs/toolkit';

import { GeneralSettingResponseDto } from '../../response-dto/setting/general-setting.response-dto';
import { preloadGeneral } from '../thunk/general.thunk';

type GeneralStoreT = GeneralSettingResponseDto & {
  loaded: boolean;
};

export const generalStore = createSlice({
  name: 'general',
  initialState: {
    loaded: false,
    mode: { state: true, name: 'Dark Mode', icon: 'moon' },
  },
  reducers: {
    invertMode: (state) => {
      state.mode = state.mode.state
        ? { state: false, name: 'Light Mode', icon: 'sun' }
        : { state: true, name: 'Dark Mode', icon: 'moon' };
    },
  },
  extraReducers(builder) {
    builder.addCase(preloadGeneral.fulfilled, (state, { payload }) => {
      state.loaded = true;
      if (payload.mode) state.mode = payload.mode;
    });
  },
});
