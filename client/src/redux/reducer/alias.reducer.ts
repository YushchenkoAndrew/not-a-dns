import { createSlice } from '@reduxjs/toolkit';

import { TableT } from '../../components/Record/RecordTable/RecordTableData';
import { AliasPageEntity } from '../../entities/alias/alias-page.entity';
import { AliasEntity } from '../../entities/alias/alias.entity';
import { PageType, QueryType } from '../../types/request.type';

export type AliasStoreT = AliasPageEntity & {
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
    builder.addCase(
      AliasPageEntity.self.select.fulfilled,
      (state, { payload }) => {
        const res: AliasPageEntity = payload.res as any;
        state.loaded = true;

        state.query = payload.options;
        state.items = res.items;

        state.page = res.page;
        state.per_page = res.per_page;
        state.total = res.total;

        const columns = AliasEntity.columns;

        state.table.rows = [];
        state.table.columns = Object.keys(columns)
          .filter((k: any) => !columns[k]?.hidden)
          .sort(
            (a, b) =>
              (columns[a]?.index ?? Infinity) - (columns[b]?.index ?? Infinity),
          );

        for (const item of res.items) {
          state.table.rows.push(state.table.columns.map((k) => item[k]));
        }
      },
    );
  },
});
