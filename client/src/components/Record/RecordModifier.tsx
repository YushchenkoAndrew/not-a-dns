import RecordLabel from './RecordLabel';

export interface RecordModifierProps {
  label: string;
}

export default function RecordModifier(props: RecordModifierProps) {
  return (
    <>
      <div className="flex flex-col mt-6 py-6 w-full border-t-2 border-gray-200 dark:border-gray-600">
        <RecordLabel value={props.label} />

        <div className="flex flex-col border-2 border-gray-100 dark:border-gray-700 rounded-md py-1 px-2">
          <p className="text-sm font-semibold mx-1 my-1 text-gray-900 dark:text-gray-200">
            Records
          </p>

          {/* <!-- FIXME: Change behavior on md & sm --> */}
          <div className="flex flex-row pb-4">
            <span className="mr-auto">
              <button
                // v-for="({ name, keys }, i) in store.records"
                className={`px-3 py-2 m-2 rounded-md ${
                  ''
                  // styles.button[i] || ''
                } hover:scale-105 hover:drop-shadow-md active:scale-100 active:drop-shadow-none dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
                // @click="() => store.selectRecord(i, keys.reduce((acc, k) => (acc[k] = '', acc), {} as ObjectLiteral))"
              >
                FIXME:
                {/* {{ name }} */}
              </button>
            </span>

            <div className="flex flex-row my-auto">
              <button
                // v-if="store.origin"
                className="flex my-auto px-4 py-3 rounded-md hover:scale-105 hover:drop-shadow-md active:scale-100 active:drop-shadow-none disabled:hover:scale-100 disabled:hover:drop-shadow-none disabled:active:scale-100 text-gray-50 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700"
                // @click="onDelete"
              >
                <i className="fa-solid fa-trash"></i>
              </button>

              <button
                className="flex ml-2 mr-3 my-auto px-3 py-2 rounded-md hover:scale-105 hover:drop-shadow-md active:scale-100 active:drop-shadow-none disabled:hover:scale-100 disabled:hover:drop-shadow-none disabled:active:scale-100 text-gray-50 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 disabled:bg-yellow-200 disabled:dark:bg-gray-700 disabled:text-gray-600 disabled:dark:text-yellow-200"
                // :disabled="!store.submit"
                // @click="onSubmit"
              >
                FIXME:
                {/* <i className="`fas ${ store.submit ? 'fa-check' : 'fa-minus' } my-auto mr-2`" /> */}
                Submit{' '}
              </button>
            </div>
          </div>
        </div>

        <div
          // v-if="store.record && Object.keys(store.record.data).length"
          className="flex flex-col border-2 border-gray-100 dark:border-gray-700 rounded-md pb-5 px-5 my-2"
        >
          TODO:
          {/* <RecordHead
        :index="store.record.index"
        :label="store.records[store.record.index]?.name || 'Empty value'"
        :keys="Object.keys(store.record.data)"
      >
        <RecordInput />
      </RecordHead> */}
        </div>
      </div>
    </>
  );
}
