import { hostRecordStore } from '../../../redux/reducer/host-record.reducer';
import { sidebarStore } from '../../../redux/reducer/sidebar.reducer';
import { useAppDispatch } from '../../../redux/storage';
import RecordLabel from '../../Record/RecordLabel';
import RecordModifier from '../../Record/RecordModifier';
import RecordTable from '../../Record/RecordTable/RecordTable';
import RecordTableData from '../../Record/RecordTable/RecordTableData';
import RecordTablePage from '../../Record/RecordTable/RecordTablePage';
import RecordTableSearch from '../../Record/RecordTable/RecordTableSearch';

export interface DefaultIndexPageProps {}

export default function DefaultIndexPage(props: DefaultIndexPageProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <div className="flex flex-col items-center justify-center py-2">
        <RecordModifier label="Action" />

        <div className="flex flex-col mt-2 mb-6 w-full">
          {/* // @click="() => store.changeView(section)" */}

          <RecordLabel
            value="Action"
            anchor="general"
            onClick={() => dispatch(sidebarStore.actions.setSection('general'))}
          />
          <p className="text-gray-900 dark:text-gray-200">Simple DNS Server</p>
        </div>

        <RecordTable label="Hosts" anchor="host_record">
          <RecordTableSearch />
          <RecordTableData className="record-table-red" store="host_record" />
          <RecordTablePage
            store="host_record"
            onClick={(page) => dispatch(hostRecordStore.actions.temp(page))}
          />
        </RecordTable>

        {/* <RecordModifier label="Modify Record" /> */}
      </div>
    </div>
  );
}
