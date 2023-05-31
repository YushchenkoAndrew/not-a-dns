import { createSlice } from '@reduxjs/toolkit';

import { GeneralSettingResponseDto } from '../../response-dto/setting/general-setting.response-dto';
import { preloadGeneral } from '../thunk/general.thunk';

function State2Mode(state: boolean) {
  return state
    ? { state: true, name: 'Dark Mode', icon: 'moon' }
    : { state: false, name: 'Light Mode', icon: 'sun' };
}

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
      state.mode = State2Mode(!state.mode.state);
    },
  },
  extraReducers(builder) {
    builder.addCase(preloadGeneral.fulfilled, (state, { payload }) => {
      state.loaded = true;
      state.mode = State2Mode(payload.mode);
    });
  },
});
