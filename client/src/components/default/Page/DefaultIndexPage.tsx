import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../../redux/storage';
import { loadHostRecords } from '../../../redux/thunk/host-record.thunk';
import RecordLabel from '../../Record/RecordLabel';
import RecordModifier from '../../Record/RecordModifier';
import RecordTable from '../../Record/RecordTable/RecordTable';
import RecordTableAction from '../../Record/RecordTable/RecordTableAction';
import RecordTableData from '../../Record/RecordTable/RecordTableData';
import RecordTablePage from '../../Record/RecordTable/RecordTablePage';

export interface DefaultIndexPageProps {}

export default function DefaultIndexPage(props: DefaultIndexPageProps) {
  const dispatch = useAppDispatch();
  const options = {
    hosts: useAppSelector((state) => state.host_record.options),
  };

  useEffect(() => {
    (async function () {
      await dispatch(loadHostRecords(undefined)).unwrap();
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

          <RecordTable label="Hosts" anchor="host_record">
            <p className="mb-5 text-gray-900 dark:text-gray-200">
              You can define custom alias here and save time by reusing them
              later. It's like having a secret stash of cookies hidden away for
              when you need a quick snack.
            </p>

            <RecordTableAction
              actions={{ create_new_record: () => console.log('TODO: Create') }}
              onSearch={(query) =>
                dispatch(loadHostRecords({ ...options.hosts, query })).unwrap()
              }
            />
            <RecordTableData className="record-table-red" store="host_record" />
            <RecordTablePage
              store="host_record"
              onClick={(page) =>
                dispatch(loadHostRecords({ ...options.hosts, page }))
              }
            />
          </RecordTable>

          <RecordTable label="Links" anchor="host_record">
            <p className="mb-5 text-gray-900 dark:text-gray-200">FIXME:</p>

            <RecordTableAction
              actions={{ create_new_record: () => console.log('TODO: Create') }}
              onSearch={(query) =>
                dispatch(loadHostRecords({ ...options.hosts, query })).unwrap()
              }
            />
            <RecordTableData className="record-table-red" store="host_record" />
            <RecordTablePage
              store="host_record"
              onClick={(page) =>
                dispatch(loadHostRecords({ ...options.hosts, page }))
              }
            />
          </RecordTable>
        </div>
      </div>
    </>
  );
}
