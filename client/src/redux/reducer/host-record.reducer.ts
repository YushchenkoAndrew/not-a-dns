import { createSlice } from '@reduxjs/toolkit';

import { TableT } from '../../components/Record/RecordTable';
import { HostPageResponseDto } from '../../response-dto/host-page.response-dto';
import { loadHostRecords } from '../thunk/host-record.thunk';

type HostStoreT = HostPageResponseDto & {
  loaded: boolean;
  table: TableT;
};

export const hostRecordStore = createSlice({
  name: 'host_record',
  initialState: {
    loaded: false,

    page: 1,
    total: 0,
    items: [],

    table: {
      columns: ['test', 'test2', 'test3'],
      rows: [
        ['test', 'test2', 'test3'],
        ['test', 'test2', 'test3'],
        ['test', 'test2', 'test3'],
        ['test', 'test2', 'test3'],
      ],
    },
  } as HostStoreT,

  reducers: {
    // setSection: (state, action: PayloadAction<string>) => {
    //   state.section = action.payload;
    // },
    // deleteFavorite: (state, action: PayloadAction<NavBarItemProps>) => {
    //   state.items.push(action.payload);
    // },
  },

  extraReducers(builder) {
    builder.addCase(loadHostRecords.fulfilled, (state, { payload }) => {
      state.loaded = true;

      state.page = payload.page;
      state.total = payload.total;
      state.items = payload.items;

      state.table = { columns: Object.keys(payload.items[0] ?? {}), rows: [] };
      for (const item of payload.items) {
        state.table.rows.push(state.table.columns.map((k) => String(item[k])));
      }
    });
  },
});
