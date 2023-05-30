import { createSlice } from '@reduxjs/toolkit';

import { TableT } from '../../components/Record/RecordTable/RecordTableData';
import { AliasEntity } from '../../entities/alias.entity';
import { AliasPageResponseDto } from '../../response-dto/alias-page.response-dto';
import { PageType, QueryType } from '../../types/request.type';
import { loadAlias } from '../thunk/alias.thunk';

export type AliasStoreT = AliasPageResponseDto & {
  loaded: boolean;
  query: PageType & QueryType;

  table: TableT<keyof AliasEntity>;
};

export const aliasStore = createSlice({
  name: 'alias_record',
  initialState: {
    loaded: false,
    query: {},

    page: 1,
    per_page: 6,
    total: 100,

    items: [],

    table: {
      ignore: ['id', 'relations'],

      columns: new Array(3).fill(''),
      rows: new Array(6).fill(new Array(3).fill('')),
    },
  } as AliasStoreT,

  reducers: {},
  extraReducers(builder) {
    builder.addCase(loadAlias.fulfilled, (state, { payload }) => {
      state.loaded = true;

      state.query = payload.options;
      state.items = payload.res.items;

      state.page = payload.res.page;
      state.per_page = payload.res.per_page;
      state.total = payload.res.total;

      state.table.rows = [];
      state.table.columns = Object.keys(payload.res.items[0] ?? {}).filter(
        (k: any) => !state.table.ignore.includes(k),
      );

      for (const item of payload.res.items) {
        state.table.rows.push(state.table.columns.map((k) => item[k]));
      }
    });
  },
});
