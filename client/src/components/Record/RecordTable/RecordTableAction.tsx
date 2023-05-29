import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

import DropdownButton, { DropdownButtonProps } from '../../DropdownButton';

export interface RecordTableActionProps extends Partial<DropdownButtonProps> {
  onSearch?: (query: string) => void;
}

export default function RecordTableAction(props: RecordTableActionProps) {
  const [search, toggleSearch] = useState<string>(null);

  useEffect(() => {
    if (search === null) return;
    const event = setTimeout(() => props.onSearch?.(search), 1000);
    return () => clearTimeout(event);
  }, [search]);

  return (
    <div className="pb-4 flex items-center justify-between">
      {props.actions ? <DropdownButton actions={props.actions} /> : <></>}

      {props.onSearch ? (
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FontAwesomeIcon
              icon="magnifying-glass"
              className="text-gray-500 dark:text-gray-400"
            />
          </div>
          <input
            type="text"
            value={search ?? ''}
            className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for items"
            onChange={(value) => toggleSearch(value.target.value)}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
