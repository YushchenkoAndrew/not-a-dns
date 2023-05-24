import { sidebarStore } from '../../../redux/reducer/sidebar';
import { useAppDispatch } from '../../../redux/storage';
import RecordLabel from '../../Record/RecordLabel';
import RecordModifier from '../../Record/RecordModifier';
import RecordTable from '../../Record/RecordTable';

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

        <RecordTable
          // v-for="({ name, keys, values }, i) in store.records"
          // :index="i"
          label="name"
          columns={['test', 'test2', 'test3']}
          rows={[
            ['test', 'test2', 'test3'],
            ['test', 'test2', 'test3'],
            ['test', 'test2', 'test3'],
            ['test', 'test2', 'test3'],
          ]}
        />

        {/* <RecordModifier label="Modify Record" /> */}
      </div>
    </div>
  );
}
