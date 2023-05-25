import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { actionStore } from './reducer/action.reducer';
import { generalStore } from './reducer/general.reducer';
import { hostRecordStore } from './reducer/host-record.reducer';
import { navbarStore } from './reducer/navbar.reducer';
import { sidebarStore } from './reducer/sidebar.reducer';

export const store = configureStore({
  reducer: {
    action: actionStore.reducer,

    general: generalStore.reducer,
    navbar: navbarStore.reducer,
    sidebar: sidebarStore.reducer,

    host_record: hostRecordStore.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type StoreT = ReturnType<typeof store.getState>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<StoreT> = useSelector;
