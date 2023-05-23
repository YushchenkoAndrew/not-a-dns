import { sidebarStore } from '../../redux/reducer/sidebar';
import { useAppDispatch } from '../../redux/storage';
import RecordLabel from '../Record/RecordLabel';

export interface IndexPageProps {}

export default function IndexPage(props: IndexPageProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <div className="flex flex-col items-center justify-center py-2">
        <div className="flex flex-col mt-2 mb-6 w-full">
          {/* // @click="() => store.changeView(section)" */}

          <RecordLabel
            value="General"
            anchor="general"
            onClick={() => dispatch(sidebarStore.actions.setSection('general'))}
          />
          <p className="text-gray-900 dark:text-gray-200">Simple DNS Server</p>
        </div>

        {/* <RecordHead
        v-for="({ name, keys, values }, i) in store.records"
        :index="i"
        :label="name"
        :keys="keys"
      >
        <RecordView :index="i" :keys="keys" :values="values" />
      </RecordHead> */}

        {/* <RecordModifier label="Modify Record" /> */}
      </div>
    </div>
  );
}
