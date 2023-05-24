import RecordLabel from './RecordLabel';

export interface RecordHeadProps {
  label: string;

  columns: string[];
  rows: string[][];

  desc?: string;
}

export default function RecordHead(props: RecordHeadProps) {
  return (
    <div className="flex flex-col my-6 w-full">
      <RecordLabel value={props.label} />

      {props.desc && (
        <p className="mb-3 text-gray-900 dark:text-gray-200">{props.desc}</p>
      )}

      <table
        className={`border-b-2 border-red-300 dark:border-red-400 border-collapse table-auto`}
      >
        <thead
          className={`bg-red-300 dark:bg-transparent dark:border-red-400 dark:border-b-4`}
        >
          <tr>
            {props.columns.map((name, index) => (
              <th
                key={index}
                className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-2 text-left"
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, index) => (
            <tr
              // v-for="row in props.values"
              key={index}
              className="group cursor-pointer text-gray-900 dark:text-gray-100"
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
                  key={index}
                  className={`p-4 decoration-2 group-hover:underline group-hover:decoration-red-300 dark:group-hover:decoration-red-400`}
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
