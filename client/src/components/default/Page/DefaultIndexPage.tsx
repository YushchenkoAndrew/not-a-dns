import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';

import { AliasEntity } from '../../../entities/alias.entity';
import { actionStore } from '../../../redux/reducer/action.reducer';
import { useAppDispatch, useAppSelector } from '../../../redux/storage';
import { loadAlias } from '../../../redux/thunk/alias.thunk';
import RecordLabel from '../../Record/RecordLabel';
import RecordModifier from '../../Record/RecordModifier';
import RecordTable from '../../Record/RecordTable/RecordTable';
import RecordTableAction from '../../Record/RecordTable/RecordTableAction';
import RecordTableData from '../../Record/RecordTable/RecordTableData';
import RecordTablePage from '../../Record/RecordTable/RecordTablePage';

export interface DefaultIndexPageProps {}

export default function DefaultIndexPage(props: DefaultIndexPageProps) {
  const dispatch = useAppDispatch();
  const alias = useAppSelector((state) => state.alias);

  useEffect(() => {
    (async function () {
      // FIXME: Strange bug when page loaded
      await dispatch(loadAlias(undefined)).unwrap();
    })();
  }, []);

  return (
    <>
      <RecordModifier
        // TODO:
        onSubmit={(res) => console.log(res)}
        onDelete={() => console.log(`DELETE: id`)}
      />

      <div className="w-full h-full p-4 overflow-y-auto">
        <div className="flex flex-col items-center justify-center py-2">
          <div className="flex flex-col mt-2 mb-6 w-full">
            <RecordLabel value="Description" anchor="general" />
            <p className="text-gray-900 dark:text-gray-200">
              With this link minimization service, you'll never have to worry
              about getting lost in a sea of long URLs. It's like finding a
              shortcut to the punchline of a dad joke - quick and efficient!
            </p>
          </div>

          <RecordTable label="Alias" anchor="alias">
            <p className="mb-5 text-gray-900 dark:text-gray-200">
              You can define custom alias here and save time by reusing them
              later. It's like having a secret stash of cookies hidden away for
              when you need a quick snack.
            </p>

            <RecordTableAction
              actions={{
                create_alias: {
                  name: (
                    <>
                      <FontAwesomeIcon icon={faPlus} className="-ml-2 mr-1" />
                      Create new record
                    </>
                  ),
                  onClick: () =>
                    dispatch(
                      actionStore.actions.onSelect({
                        type: 'alias',
                        table: alias.table,
                        data: new AliasEntity(),
                      }),
                    ),
                },
              }}
              onSearch={(query) =>
                dispatch(loadAlias({ ...alias.query, query })).unwrap()
              }
            />
            <RecordTableData className="record-table-red" store="alias" />
            <RecordTablePage
              store="alias"
              onClick={(page) => dispatch(loadAlias({ ...alias.query, page }))}
            />
          </RecordTable>

          {/* TODO: */}

          <RecordTable label="Links" anchor="host_record">
            <p className="mb-5 text-gray-900 dark:text-gray-200">FIXME:</p>

            <RecordTableAction
              actions={{}}
              onSearch={(query) =>
                dispatch(loadAlias({ ...alias.query, query })).unwrap()
              }
            />
            <RecordTableData className="record-table-red" store="alias" />
            <RecordTablePage
              store="alias"
              onClick={(page) => dispatch(loadAlias({ ...alias.query, page }))}
            />
          </RecordTable>
        </div>
      </div>
    </>
  );
}
