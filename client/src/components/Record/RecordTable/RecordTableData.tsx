import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CommonEntity } from '../../../entities/common.entity';
import { actionStore } from '../../../redux/reducer/action.reducer';
import { StoreT, useAppDispatch, useAppSelector } from '../../../redux/storage';

export type TableT<T = string> = {
  columns: string[];
  rows: string[][];

  ignore: T[];
  relation: T[];
};

type RecordT = {
  loaded?: boolean;
  items: CommonEntity[];
  table: TableT;
};

export interface RecordTableDataProps<
  K extends keyof StoreT,
  V extends StoreT[K],
> {
  store: V extends RecordT ? K : never;
  className?: string;
}

export default function RecordTableData<
  K extends keyof StoreT,
  V extends StoreT[K],
>(props: RecordTableDataProps<K, V>) {
  const { loaded, items, table } = useAppSelector<RecordT>(
    (state) => state[props.store as string],
  );
  const dispatch = useAppDispatch();

  return (
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
                <span className="animate-pulse block w-full h-2 my-2 rounded-full" />
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
              loaded === false
                ? null
                : dispatch(
                    actionStore.actions.onSelect({
                      table: table,
                      type: props.store as any,
                      data: items[index],
                    }),
                  )
            }
          >
            {row.map((value, index) => (
              <td
                key={`${props.store}_tbody_td_${index}`}
                className="p-4 decoration-2"
              >
                {loaded === false ? (
                  <span className="animate-pulse block w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
                ) : typeof value == 'boolean' ? (
                  <FontAwesomeIcon
                    className={value ? 'text-amber-400' : ''}
                    icon={value ? faStar : farStar}
                  />
                ) : (
                  value
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
