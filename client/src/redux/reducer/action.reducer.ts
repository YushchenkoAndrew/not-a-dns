import { createSlice } from '@reduxjs/toolkit';

export const actionStore = createSlice({
  name: 'action',
  initialState: {
    // TODO:
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
    // builder.addCase(preloadGeneral.fulfilled, (state, { payload }) => {
    //   state.loaded = true;
    //   if (payload.mode) state.mode = payload.mode;
    // });
  },
});
