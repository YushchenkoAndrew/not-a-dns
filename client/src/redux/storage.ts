import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { generalStore } from './reducer/general';
import { navbarStore } from './reducer/navbar';
import { sidebarStore } from './reducer/sidebar';

export const store = configureStore({
  reducer: {
    general: generalStore.reducer,
    navbar: navbarStore.reducer,
    sidebar: sidebarStore.reducer,
  },
});

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
