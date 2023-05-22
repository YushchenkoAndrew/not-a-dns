import { ReactNode, useState } from 'react';

export interface NavBarProps {
  name: string;
  children: ReactNode;
}

export default function NavBar(props: NavBarProps) {
  const [collapse, setCollapse] = useState(true);

  return (
    <nav className="px-2 relative z-10 sm:px-4 py-2.5 bg-gray-800 dark:bg-slate-900">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <span className="self-center text-xl px-3 font-bold whitespace-nowrap text-gray-50">
          {props.name}
        </span>
        <button
          type="button"
          className="inline-flex sm:hidden items-center rounded-lg p-2 ml-3 text-gray-400 hover:bg-gray-700 focus:outline-none"
          onClick={() => setCollapse(!collapse)}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div
          className={`${collapse ? 'hidden' : ''} w-full sm:block sm:w-auto`}
        >
          <ul className="flex flex-col sm:flex-row sm:space-x-8 mt-3 sm:mt-0 ml-3 sm:ml-0 sm:text-sm sm:font-medium">
            {props.children}
          </ul>
        </div>
      </div>
    </nav>
  );
}
