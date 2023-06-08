import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef } from 'react';
import { CommonEntity } from '../../entities/common.entity';

import { StringService } from '../../lib';
import { actionStore } from '../../redux/reducer/action.reducer';
import { useAppDispatch, useAppSelector } from '../../redux/storage';
import { RECORD_TABLE_COLOR_TYPE } from '../../types/record-table-color.type';
import DropdownButton from '../DropdownButton';
import RecordTable from './RecordTable/RecordTable';
import RecordTableData from './RecordTable/RecordTableData';

type SectionT = [string, [string, CommonEntity[]]];

export interface RecordModifierProps {
  // // onSubmit: (prop: ActionOptions, res: ObjectLiteral) => void;
  // // onDelete: (prop: ActionOptions) => void;
}

export default function RecordModifier(props: RecordModifierProps) {
  const popupRef = useRef(null);

  const dispatch = useAppDispatch();
  const { options, table, original } = useAppSelector((state) => state.action);

  useEffect(() => {
    const handler = {
      keydown: (event: KeyboardEvent) =>
        popupRef.current && event.key == 'Escape'
          ? dispatch(actionStore.actions.unfocus())
          : undefined,
      mousedown: (event: MouseEvent) =>
        popupRef.current && !popupRef.current.contains(event.target)
          ? dispatch(actionStore.actions.unfocus())
          : undefined,
    };

    document.addEventListener('keydown', handler.keydown);
    document.addEventListener('mousedown', handler.mousedown);
    return () => {
      document.removeEventListener('keydown', handler.keydown);
      document.removeEventListener('mousedown', handler.mousedown);
    };
  }, [popupRef]);

  return table ? (
    <div>
      <div
        ref={popupRef}
        className="record-modifier fixed top-1/2 left-1/2 w-full max-w-2xl lg:max-w-4xl xl:max-w-6xl max-h-full -translate-y-1/2 -translate-x-1/2 z-50 p-4 overflow-x-hidden overflow-y-auto"
      >
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl ml-1 font-semibold text-gray-900 dark:text-white">
              Record Modifier
            </h3>
            <FontAwesomeIcon
              icon="xmark"
              className="w-5 h-5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => dispatch(actionStore.actions.unfocus())}
            />
          </div>

          <form
            className="flex flex-col p-6"
            onSubmit={(event) => {
              event?.preventDefault();
              if (!event.currentTarget.checkValidity()) {
                event.stopPropagation();
                return;
              }

              const data = table.columns.reduce(
                (acc, k, index) => ((acc[k] = table.rows[0][index]), acc),
                {},
              );

              dispatch(
                original.save(original.newInstance(data).build(original)),
              )
                .unwrap()
                .then(() => dispatch(actionStore.actions.unfocus()));
            }}
          >
            <div className="py-3 flex items-center justify-between">
              <DropdownButton
                actions={{
                  //- favorite: {
                  //-   name: (
                  //-     <>
                  //-     FIXME:
                  //-       {/* <FontAwesomeIcon icon="star" className="mr-2" />
                  //-       {options.isFavorite
                  //-         ? 'Unset from favorite'
                  //-         : 'Set as favorite'} */}
                  //-     </>
                  //-   ),
                  //- hidden: options.isFavorite === undefined,
                  //- onClick: () =>
                  //-   dispatch(actionStore.actions.toggleFavorite()),
                  //- },
                  delete: {
                    name: (
                      <>
                        <FontAwesomeIcon icon="trash" className="mr-2" />
                        Delete record
                      </>
                    ),
                    hidden: options.id === undefined,
                    onClick: () =>
                      dispatch(original.delete())
                        .unwrap()
                        .then(() => dispatch(actionStore.actions.unfocus())),
                  },
                }}
              />

              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </div>

            <table
              className={`${'record-table-red'} border-b-2 border-collapse table-auto`}
            >
              <thead className="dark:border-b-4">
                <tr>
                  {table.columns.map((name, index) => (
                    <th
                      key={`modifier_thead_${index}`}
                      className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-2 text-left"
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr className="text-gray-900 dark:text-gray-100 ">
                    {row.map((value, index) => (
                      <td
                        key={`modifier_tbody_td_${index}`}
                        className="p-4 decoration-2"
                      >
                        {/* // TODO: Add auto suggestion and linking */}
                        {/* // TODO: Add ability to display boolean values */}
                        <input
                          name={table.columns[index]}
                          value={value}
                          required={
                            original.columns[table.columns[index]]?.required
                          }
                          className="pt-1 pb-1 px-3 w-full border-b-2 focus:border-b-4 last:border-r-0 dark:bg-gray-800 dark:focus:bg-gray-700 focus:outline-none"
                          placeholder="Insert value"
                          onChange={(event) =>
                            dispatch(
                              actionStore.actions.onUpdate({
                                name: table.columns[index],
                                value: event.target.value,
                              }),
                            )
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </form>

          {Object.values(original.columns)
            .filter(({ related }) => related)
            .map(({ key }) =>
              Object.entries(original[key] || []).map((res) => [key, res]),
            )
            .flat()
            .map(([section, [name, items]]: SectionT, index) => (
              <div className="flex flex-col p-6">
                <RecordTable
                  label={`${StringService.capitalize(section)} ${name} items`}
                  anchor="alias"
                >
                  <p className="mb-5 text-gray-900 dark:text-gray-200">
                    Trying to describe why you liked that weird items: 'It's,
                    um, a conversation starter?'
                  </p>

                  {items[0] && (
                    <RecordTableData
                      key={index}
                      className={`${RECORD_TABLE_COLOR_TYPE[5]}`}
                      table={(function () {
                        const columns = Object.keys(items[0].columns)
                          .filter((k: any) => !items[0].columns[k]?.hidden)
                          .sort(
                            (a, b) =>
                              (items[0].columns[a]?.index ?? Infinity) -
                              (items[0].columns[b]?.index ?? Infinity),
                          );

                        const rows = items.map((item) =>
                          columns.map((k) => item[k]),
                        );

                        return { columns, rows };
                      })()}
                      items={items as any}
                    />
                  )}
                </RecordTable>
              </div>
            ))}
        </div>
      </div>
      <div className="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>
    </div>
  ) : (
    <></>
  );
}
