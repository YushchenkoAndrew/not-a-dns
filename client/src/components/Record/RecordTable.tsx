import { StoreT, useAppSelector } from '../../redux/storage';
import RecordLabel from './RecordLabel';

export type TableT = {
  columns: string[];
  rows: string[][];
};

export interface RecordTableProps<K extends keyof StoreT, V extends StoreT[K]> {
  label: string;
  store: V extends { table: TableT } ? K : never;

  className?: string;
  desc?: string;
}

export default function RecordTable<
  K extends keyof StoreT,
  V extends StoreT[K],
>(props: RecordTableProps<K, V>) {
  const { table } = useAppSelector<{ table: TableT }>(
    (state) => state[props.store as string],
  );

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
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, index) => (
            <tr
              // v-for="row in props.values"
              key={`${props.store}_tbody_${index}`}
              className="cursor-pointer text-gray-900 dark:text-gray-100"
              onClick={() => console.log(index)}
              // @click="
              //   () =>
              //     onRecordSelect(
              //       keys.reduce((acc, key, i) => ((acc[key] = row[i]), acc), {} as ObjectLiteral)
              //     )
              // "
            >
              {row.map((value, index) => (
                <td
                  key={`${props.store}_tbody_td_${index}`}
                  className="p-4 decoration-2"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
