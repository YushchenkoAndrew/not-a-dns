import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface RecordTableSearchProps {}

export default function RecordTableSearch(props: RecordTableSearchProps) {
  // TODO:
  return (
    <div className="pb-4">
      <label className="sr-only">Search</label>
      <div className="relative mt-1">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FontAwesomeIcon
            icon="magnifying-glass"
            className="text-gray-500 dark:text-gray-400"
          />
        </div>
        <input
          type="text"
          className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search for items"
        />
      </div>
    </div>
  );
}
