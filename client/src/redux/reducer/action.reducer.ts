import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TableT } from '../../components/Record/RecordTable/RecordTableData';
import { ObjectLiteral } from '../../types';
import { ActionTypes } from '../../types/action.types';

export type ActionOptions = { type: (typeof ActionTypes)[number] } & Partial<
  {
    id: string;
    isFavorite: boolean;
    required: string[];
  } & Pick<TableT, 'ignore' | 'relation'>
>;

type ActionT = {
  options: ActionOptions;

  original: ObjectLiteral;
  data: ObjectLiteral;
};

export const actionStore = createSlice({
  name: 'action',
  initialState: {
    options: { type: null },
    data: null,
  } as ActionT,
  reducers: {
    onSelect: (
      state,
      {
        payload,
      }: PayloadAction<{
        type: (typeof ActionTypes)[number];
        table: Pick<TableT, 'ignore' | 'relation'>;
        data: ObjectLiteral;
      }>,
    ) => {
      state.options.id = payload.data.id;
      state.options.type = payload.type as any;
      state.options.isFavorite = payload.data.favorite;

      state.options.ignore = payload.table.ignore.concat('favorite');
      state.options.relation = payload.table.relation;

      state.original = { ...payload.data };
      state.data = {};

      for (const k in payload.data) {
        if (state.options.ignore.includes(k)) continue;
        if (state.options.relation.includes(k)) continue;

        state.data[k] = payload.data[k];
      }
    },
    onUpdate: (
      state,
      { payload }: PayloadAction<{ name: string; value: string }>,
    ) => {
      state.data[payload.name] = payload.value;
    },

    toggleFavorite: (state) => {
      state.options.isFavorite = !state.options.isFavorite;
    },

    unfocus: (state) => {
      state.options = { type: null };
      state.data = null;
    },
  },
  extraReducers(builder) {
    // builder.addCase(preloadGeneral.fulfilled, (state, { payload }) => {
    //   state.loaded = true;
    //   if (payload.mode) state.mode = payload.mode;
    // });
  },
});
