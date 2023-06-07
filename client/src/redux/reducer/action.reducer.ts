import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  RecordT,
  TableT,
} from '../../components/Record/RecordTable/RecordTableData';
import { CommonResponseDto } from '../../response-dto/common.response-dto';
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
  options: ActionOptions;

  original: CommonResponseDto;
  table: TableT;

  additional: ObjectLiteral<RecordT>;
};
type SelectAction = {
  /**
   * This param has the next logic:
   * if id is set then UPDATE / DELETE,
   * if type is set CREATE
   */
  optional: OptionalT;
  data: CommonResponseDto;
  // ObjectLiteral & { options: ObjectLiteral<ResponseProps> };
};

export const actionStore = createSlice({
  name: 'action',
  initialState: {
    options: { type: null },

    original: null,
    table: null,

    additional: null,
  } as ActionT,
  reducers: {
    onSelect: (state, { payload }: PayloadAction<SelectAction>) => {
      if ('id' in payload.optional) state.options.id = (payload.data as any).id;
      else state.options.type = payload.optional.type as any;

      // state.options.isFavorite = payload.data.favorite;
      // state.options.className = payload.optional.className;
      // state.options.options = payload.optional.

      // state.original = { ...payload.data };
      state.additional = {};
      state.original = payload.data;

      state.table = { columns: [], rows: [] };
      state.table.rows = [];
      state.table.columns = Object.keys(payload.data ?? {})
        .filter((k: any) => !state.original.options[k]?.hidden)
        .sort(
          (a, b) =>
            (state.original.options[a]?.index ?? Infinity) -
            (state.original.options[b]?.index ?? Infinity),
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
      state.options = {};
      state.table = null;
    },
  },
});
