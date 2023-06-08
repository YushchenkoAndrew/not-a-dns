import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  RecordT,
  TableT,
} from '../../components/Record/RecordTable/RecordTableData';
import { CommonEntity } from '../../entities/common.entity';
import { ObjectLiteral } from '../../types';
import { ACTION_TYPES } from '../../types/action.types';

type OptionalT = ({ id: string } | { type: (typeof ACTION_TYPES)[number] }) & {
  className?: string;
};

export type ActionOptions = Partial<{
  id?: string;
  type?: (typeof ACTION_TYPES)[number];
}>;

type ActionT = {
  focused: boolean;

  options: ActionOptions;

  original: CommonEntity;
  table: TableT;
};
type SelectAction = {
  /**
   * This param has the next logic:
   * if id is set then UPDATE / DELETE,
   * if type is set CREATE
   */
  optional: OptionalT;
  data: CommonEntity;
  // ObjectLiteral & { options: ObjectLiteral<ResponseProps> };
};

export const actionStore = createSlice({
  name: 'action',
  initialState: {
    focused: false,

    options: { type: null },

    original: null,
    table: null,
  } as ActionT,
  reducers: {
    onSelect: (state, { payload }: PayloadAction<SelectAction>) => {
      if ('id' in payload.optional) state.options.id = (payload.data as any).id;
      else state.options.type = payload.optional.type as any;

      // state.options.isFavorite = payload.data.favorite;
      // state.options.className = payload.optional.className;
      // state.options.options = payload.optional.

      // state.original = { ...payload.data };
      state.original = payload.data;

      state.table = { columns: [], rows: [] };
      state.table.rows = [];
      state.table.columns = Object.keys(payload.data ?? {})
        .filter((k: any) => !state.original.columns[k]?.hidden)
        .sort(
          (a, b) =>
            (state.original.columns[a]?.index ?? Infinity) -
            (state.original.columns[b]?.index ?? Infinity),
        );

      state.table.rows = [state.table.columns.map((k) => payload.data[k])];
      console.log(state.table.columns);
      console.log(state.table.rows);
    },
    onUpdate: (
      state,
      { payload }: PayloadAction<{ name: string; value: string }>,
    ) => {
      const index = state.table.columns.indexOf(payload.name);
      state.table.rows[0][index] = payload.value;
    },

    // toggleFavorite: (state) => {
    //   state.options.isFavorite = !state.options.isFavorite;
    // },

    unfocus: (state) => {
      state.focused = false;
      state.options = {};
      state.table = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      CommonEntity.self.findOne.fulfilled,
      (state, { payload }) => {
        // if ('id' in payload.optional) state.options.id = (payload.data as any).id;
        // else state.options.type = payload.optional.type as any;

        state.focused = true;
        state.options.id = (payload as any).id;

        // state.options.isFavorite = payload.data.favorite;
        // state.options.className = payload.optional.className;
        // state.options.options = payload.optional.

        // state.original = { ...payload.data };
        state.original = payload;

        state.table = { columns: [], rows: [] };
        state.table.rows = [];
        state.table.columns = Object.keys(state.original.columns)
          .filter((k: any) => !state.original.columns[k]?.hidden)
          .sort(
            (a, b) =>
              (state.original.columns[a]?.index ?? Infinity) -
              (state.original.columns[b]?.index ?? Infinity),
          );

        state.table.rows = [state.table.columns.map((k) => payload[k])];
      },
    );
  },
});
