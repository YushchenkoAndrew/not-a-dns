import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TableT } from '../../components/Record/RecordTable/RecordTableData';
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
    per_page: 6,
    total: 100,

    items: [],

    table: {
      columns: new Array(3).fill(''),
      rows: new Array(6).fill(new Array(3).fill('')),
    },
  } as HostStoreT,

  reducers: {
    // setSection: (state, action: PayloadAction<string>) => {
    //   state.section = action.payload;
    // },
    temp: (state, { payload }: PayloadAction<number>) => {
      console.log(payload);

      state.page = payload;
    },

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
