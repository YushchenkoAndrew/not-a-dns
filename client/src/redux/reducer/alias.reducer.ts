import { createSlice } from '@reduxjs/toolkit';

import { TableT } from '../../components/Record/RecordTable/RecordTableData';
import { AliasPageResponseDto } from '../../response-dto/alias/alias-page-response.dto';
import { AliasResponseDto } from '../../response-dto/alias/alias-response.dto';
import { PageType, QueryType } from '../../types/request.type';
import { loadAlias } from '../thunk/alias.thunk';

export type AliasStoreT = AliasPageResponseDto & {
  loaded: boolean;
  query: PageType & QueryType;

  table: TableT;
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

      const options = AliasResponseDto.options;

      state.table.rows = [];
      state.table.columns = Object.keys(payload.res.items[0] ?? {})
        .filter((k: any) => !options[k]?.hidden)
        .sort(
          (a, b) =>
            (options[a]?.index ?? Infinity) - (options[b]?.index ?? Infinity),
        );

      for (const item of payload.res.items) {
        state.table.rows.push(state.table.columns.map((k) => item[k]));
      }
    });
  },
});
