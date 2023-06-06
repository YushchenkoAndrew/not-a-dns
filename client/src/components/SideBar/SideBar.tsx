import { ReactNode } from 'react';

export interface SideBarProps {
  children: ReactNode;
}

export default function SideBar(props: SideBarProps) {
  return (
    //  <!-- // FIXME: ON sm display table correctly !!! -->
    <div className="flex flex-col p-4 text-gray-900 w-full sm:w-96 sm:h-screen">
      <p className="text-xl font-bold whitespace-nowrap text-gray-800 dark:text-gray-50 hidden fixed sm:block sm:top-8">
        not-a-dns
      </p>
      <ul className="flex flex-wrap flex-col mb-auto sm:fixed">
        {props.children}
      </ul>
    </div>
  );
}
