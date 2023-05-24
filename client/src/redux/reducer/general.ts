import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GeneralSettingResponseDto } from '../../response-dto/general-setting.response-dto';

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
    init(state, { payload }: PayloadAction<Partial<GeneralStoreT>>) {
      state.loaded = true;
      if (payload.mode) state.mode = payload.mode;
    },

    invertMode: (state) => {
      state.mode = state.mode.state
        ? { state: false, name: 'Light Mode', icon: 'sun' }
        : { state: true, name: 'Dark Mode', icon: 'moon' };
    },
  },
});
