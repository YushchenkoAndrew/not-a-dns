import { createSlice } from '@reduxjs/toolkit';

import { SettingResponseDto } from '../../response-dto/setting/general-setting.response-dto';
import { invertMode, preloadGeneral } from '../thunk/general.thunk';

function State2Mode(state: boolean) {
  return state
    ? { state: true, name: 'Dark Mode', icon: 'moon' }
    : { state: false, name: 'Light Mode', icon: 'sun' };
}

type GeneralStoreT = {
  loaded: boolean;

  mode: ReturnType<typeof State2Mode>;
  res: SettingResponseDto;
};

export const generalStore = createSlice({
  name: 'general',
  initialState: {
    loaded: false,
    mode: { state: true, name: 'Dark Mode', icon: 'moon' },

    res: null,
  } as GeneralStoreT,
  reducers: {
    // invertMode: (state) => {
    // },
  },
  extraReducers(builder) {
    builder.addCase(preloadGeneral.fulfilled, (state, { payload }) => {
      state.loaded = true;

      state.res = payload;
      state.mode = State2Mode(payload.mode);
    });

    builder.addCase(invertMode.pending, (state) => {
      state.mode = State2Mode(!state.mode.state);
    });

    builder.addCase(invertMode.fulfilled, (state, { payload }) => {
      state.res = payload;
    });
  },
});
