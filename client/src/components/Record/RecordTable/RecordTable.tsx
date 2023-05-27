import { ReactNode } from 'react';

import RecordLabel from '../RecordLabel';

export interface RecordTableProps {
  label: string;
  anchor?: string;

  desc?: string;

  children: ReactNode;
}

export default function RecordTable(props: RecordTableProps) {
  return (
    <div className="flex flex-col my-6 w-full">
      <RecordLabel value={props.label} anchor={props.anchor} />

      {props.desc && (
        <p className="mb-3 text-gray-900 dark:text-gray-200">{props.desc}</p>
      )}

      {props.children}
    </div>
  );
}
