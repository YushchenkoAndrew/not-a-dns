import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { actionStore } from '../../../redux/reducer/action.reducer';
import { StoreT, useAppDispatch, useAppSelector } from '../../../redux/storage';

export type TableT<T = string> = {
  columns: string[];
  rows: string[][];

  ignore: T[];
};

export interface RecordT {
  loaded?: boolean;
  items: { id: string }[];
  table: TableT;
}

export interface RecordTableDataStoreProps<
  K extends keyof StoreT,
  U extends StoreT[K],
> {
  store: U extends RecordT ? K : never;
  className?: string;
}

export interface RecordTableDataStoreDirect extends RecordT {
  className?: string;
}

function isStore<K extends keyof StoreT, U extends StoreT[K]>(
  props: RecordTableDataStoreProps<K, U> | RecordTableDataStoreDirect,
): props is RecordTableDataStoreProps<K, U> {
  return (props as any).store !== undefined;
}

export default function RecordTableData<
  K extends keyof StoreT,
  U extends StoreT[K],
>(props: RecordTableDataStoreDirect | RecordTableDataStoreProps<K, U>) {
  const dispatch = useAppDispatch();
  const { loaded, items, table } = useAppSelector<RecordT>((state) =>
    isStore(props) ? state[props.store as string] : props,
  );

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
              key={`${isStore(props) ? props.store : ''}_thead_${index}`}
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
            key={`${isStore(props) ? props.store : ''}_tbody_${index}`}
            className="cursor-pointer text-gray-900 dark:text-gray-100"
            onClick={() =>
              loaded === false
                ? null
                : dispatch(
                    actionStore.actions.onSelect({
                      ignore: table.ignore,
                      optional: {
                        id: items[index].id,
                        className: props.className,
                      },
                      data: items[index],
                    }),
                  )
            }
          >
            {row.map((value, index) => (
              <td
                key={`${isStore(props) ? props.store : ''}_tbody_td_${index}`}
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
