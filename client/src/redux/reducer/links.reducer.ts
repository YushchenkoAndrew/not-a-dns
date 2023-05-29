import { createSlice } from '@reduxjs/toolkit';

import { TableT } from '../../components/Record/RecordTable/RecordTableData';
import { AliasPageResponseDto } from '../../response-dto/alias-page.response-dto';
import { PageType, QueryType } from '../../types/request.type';
import { loadLinks } from '../thunk/links.thunk';

export type LinkStoreT = AliasPageResponseDto & {
  loaded: boolean;
  options: PageType & QueryType;

  table: TableT;
};

export const linkRecordStore = createSlice({
  name: 'links',
  initialState: {
    loaded: false,
    options: {},

    page: 1,
    per_page: 6,
    total: 100,

    items: [],

    table: {
      columns: new Array(3).fill(''),
      rows: new Array(6).fill(new Array(3).fill('')),

      ignore: [],
      relation: [],
    },
  } as LinkStoreT,

  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      loadLinks.fulfilled,
      (state, { payload: { options, res } }) => {
        state.loaded = true;
        state.options = options;

        state.page = res.page;
        state.total = res.total;
        state.items = res.items;

        state.table.rows = [];
        state.table.columns = Object.keys(res.items[0] ?? {});

        for (const item of res.items) {
          state.table.rows.push(state.table.columns.map((k) => item[k]));
        }
      },
    );
  },
});
