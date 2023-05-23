import { createSlice } from '@reduxjs/toolkit';

export const generalStore = createSlice({
  name: 'general',
  initialState: {
    mode: { state: true, name: 'Dark Mode', icon: 'moon' },
  },
  reducers: {
    invertMode: (state) => {
      state.mode = state.mode.state
        ? { state: false, name: 'Light Mode', icon: 'sun' }
        : { state: true, name: 'Dark Mode', icon: 'moon' };
    },
  },
});
