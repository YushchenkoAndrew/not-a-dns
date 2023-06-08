import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CommonEntity } from '../../../entities/common.entity';
import { StoreT, useAppDispatch, useAppSelector } from '../../../redux/storage';

export type TableT = {
  columns: string[];
  rows: string[][];
};

export interface RecordT {
  loaded?: boolean;
  items: (CommonEntity & { id: string })[];
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
              className={`font-semibold text-gray-900 dark:text-gray-100 px-4 py-2 text-left ${
                loaded === false
                  ? ''
                  : items[index]?.columns[table.columns[index]]?.className ?? ''
              }`}
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
            id={items[index]?.id ?? undefined}
            key={`${isStore(props) ? props.store : ''}_tbody_${index}`}
            className="cursor-pointer text-gray-900 dark:text-gray-100"
            onClick={() =>
              loaded === false
                ? null
                : dispatch(
                    items[index].findOne(),
                    // actionStore.actions.onSelect({
                    //   optional: {
                    //     id: items[index].id,
                    //     className: props.className,
                    //   },
                    //   data: items[index],
                    // }),
                  )
            }
          >
            {row.map((value, index) => (
              <td
                key={`${isStore(props) ? props.store : ''}_tbody_td_${index}`}
                className="p-4 decoration-2 truncate max-w-xs xl:max-w-xl"
              >
                {loaded === false ? (
                  <span className="animate-pulse block w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
                ) : typeof value == 'boolean' ? (
                  items[index].columns[table.columns[index]]?.icon ? (
                    <FontAwesomeIcon
                      className={value ? 'text-blue-500' : ''}
                      icon={
                        items[index].columns[table.columns[index]].icon[
                          value
                        ] ?? faQuestion
                      }
                    />
                  ) : (
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={value}
                    />
                  )
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
