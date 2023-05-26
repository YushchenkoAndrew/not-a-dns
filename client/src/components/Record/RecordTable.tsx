import { useEffect } from 'react';

import { CommonEntity } from '../../entities/common.entity';
import { actionStore } from '../../redux/reducer/action.reducer';
import { StoreT, useAppDispatch, useAppSelector } from '../../redux/storage';
import RecordLabel from './RecordLabel';

export type TableT = {
  columns: string[];
  rows: string[][];
};

type RecordT = {
  loaded?: boolean;
  items: CommonEntity[];
  table: TableT;
};

export interface RecordTableProps<K extends keyof StoreT, V extends StoreT[K]> {
  label: string;
  store: V extends RecordT ? K : never;

  className?: string;
  desc?: string;
}

export default function RecordTable<
  K extends keyof StoreT,
  V extends StoreT[K],
>(props: RecordTableProps<K, V>) {
  const empty = new Array(3).fill('');
  const { loaded, items, table } = useAppSelector<RecordT>(
    (state) => state[props.store as string],
  );
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col my-6 w-full">
      <RecordLabel value={props.label} anchor={props.store} />

      {props.desc && (
        <p className="mb-3 text-gray-900 dark:text-gray-200">{props.desc}</p>
      )}

      <table
        className={`${
          props.className ?? ''
        } border-b-2 border-collapse table-auto`}
      >
        <thead className="dark:border-b-4">
          <tr>
            {table.columns.map((name, index) => (
              <th
                key={`${props.store}_thead_${index}`}
                className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-2 text-left"
              >
                {loaded === false ? (
                  // TODO: Make pulse animation work
                  <span className="w-full grid bg-gray-200 rounded-full dark:bg-gray-700 ">
                    t
                  </span>
                ) : (
                  name
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, index) => (
            <tr
              key={`${props.store}_tbody_${index}`}
              className="cursor-pointer text-gray-900 dark:text-gray-100"
              onClick={() =>
                dispatch(actionStore.actions.onSelect(items[index]))
              }
            >
              {row.map((value, index) => (
                <td
                  key={`${props.store}_tbody_td_${index}`}
                  className="p-4 decoration-2"
                >
                  {loaded === false ? (
                    // TODO: Make pulse animation work
                    <span className="h-2.5 w-full bg-gray-200 rounded-full dark:bg-gray-700 ">
                      t
                    </span>
                  ) : (
                    value
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
