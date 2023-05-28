import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { StringService } from '../lib';
import { ObjectLiteral } from '../types';

type ActionT = {
  name: ReactNode;
  onClick: () => void;
  hidden?: boolean;
};

export interface DropdownButtonProps {
  actions: ObjectLiteral<ActionT['onClick'] | ActionT>;
}

export default function DropdownButton(props: DropdownButtonProps) {
  const dropdownRef = useRef(null);
  const [expand, toggleExpand] = useState(false);

  useEffect(() => {
    const handler = (event: MouseEvent) =>
      dropdownRef.current && !dropdownRef.current.contains(event.target)
        ? toggleExpand(false)
        : undefined;

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownRef]);

  return (
    <div>
      <button
        className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        type="button"
        onClick={() => toggleExpand(true)}
      >
        <FontAwesomeIcon icon="bars-progress" className="mr-2 text-gray-400" />
        Actions
        <FontAwesomeIcon icon="chevron-down" className="ml-2" />
      </button>
      <div
        ref={dropdownRef}
        hidden={!expand}
        className="z-10 absolute w-auto mt-3 rounded-md shadow-lg bg-gray-50 divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600"
      >
        <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
          {Object.entries(props.actions)
            .filter(
              ([_, action]) =>
                typeof action === 'function' || action.hidden !== true,
            )
            .map(([key, action], index) => (
              <li
                key={`${key}_${index}`}
                className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <a
                  className="w-full ml-2 text-sm font-medium cursor-pointer text-gray-900 rounded dark:text-gray-300"
                  onClick={() => (
                    typeof action === 'function' ? action() : action.onClick(),
                    toggleExpand(false)
                  )}
                >
                  {typeof action === 'function'
                    ? StringService.humanize(key)
                    : action.name}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
