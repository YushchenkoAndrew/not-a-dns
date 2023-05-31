import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  RecordT,
  TableT,
} from '../../components/Record/RecordTable/RecordTableData';
import { ObjectLiteral } from '../../types';
import { ACTION_TYPES } from '../../types/action.types';

type OptionalT = ({ id: string } | { type: (typeof ACTION_TYPES)[number] }) & {
  className?: string;
};

export type ActionOptions = Partial<
  {
    id?: string;
    type?: (typeof ACTION_TYPES)[number];
    className?: string;

    isFavorite: boolean;
    required: string[];
  } & Pick<TableT, 'ignore'>
>;

type ActionT = {
  options: ActionOptions;

  original: ObjectLiteral;
  data: ObjectLiteral;

  additional: ObjectLiteral<RecordT>;
};

export const actionStore = createSlice({
  name: 'action',
  initialState: {
    options: { type: null },

    additional: null,
    original: null,
    data: null,
  } as ActionT,
  reducers: {
    onSelect: (
      state,
      {
        payload,
      }: PayloadAction<{
        /**
         * This param has the next logic:
         * if id is set then UPDATE / DELETE,
         * if type is set CREATE
         */
        optional: OptionalT;
        ignore: string[];
        data: ObjectLiteral;
      }>,
    ) => {
      if ('id' in payload.optional) state.options.id = payload.data.id;
      else state.options.type = payload.optional.type as any;

      state.options.isFavorite = payload.data.favorite;
      state.options.className = payload.optional.className;
      state.options.ignore = payload.ignore.concat('favorite');

      state.original = { ...payload.data };
      state.additional = {};
      state.data = {};

      for (const k in payload.data) {
        if (typeof payload.data[k] == 'object') {
          const items = Array.isArray(payload.data[k])
            ? payload.data[k]
            : [payload.data[k]];

          const keys = Object.keys(items[0] || {}).filter(
            (k) => !payload.ignore.includes(k),
          );

          if (!state.additional[keys.join(';')]) {
            state.additional[keys.join(';')] = {
              table: {
                ignore: state.options.ignore.concat(),
                columns: keys,
                rows: [],
              },
              items: [],
            };
          }

          const store = state.additional[keys.join(';')];
          store.items.push(...items);

          for (const item of items) {
            store.table.rows.push(store.table.columns.map((k) => item[k]));
          }
        }

        if (state.options.ignore.includes(k)) continue;
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
      state.options = {};
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
