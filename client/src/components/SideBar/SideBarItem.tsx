import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';

import { sidebarStore } from '../../redux/reducer/sidebar';
import { useAppDispatch, useAppSelector } from '../../redux/storage';

export interface SideBarItemProps {
  name: string;
  anchor: string;

  icon?: string;
  onClick?: () => void;

  children?: ReactNode;
}

export default function SideBarItem(props: SideBarItemProps) {
  const selected = useAppSelector((state) => state.sidebar.section);
  const dispatch = useAppDispatch();

  return (
    <li className="my-1">
      <a
        className={
          props.anchor && selected == props.anchor
            ? 'block py-2 px-4 rounded bg-gray-700 text-white hover:bg-gray-800 hover:text-gray-200 active:bg-gray-900 active:text-gray-200 dark:bg-slate-900 dark:hover:bg-slate-700 dark:active:bg-gray-900 dark:active:text-gray-50'
            : 'group cursor-pointer block py-2 px-4 rounded bg-gray-50 text-gray-800 hover:bg-gray-200 active:bg-gray-300 active:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-slate-700 dark:active:bg-slate-700 dark:active:text-gray-50'
        }
        href={props.anchor ? `#${props.anchor}` : undefined}
        onClick={() =>
          props.onClick
            ? props.onClick()
            : props.anchor && selected !== props.anchor
            ? dispatch(sidebarStore.actions.setSection(props.anchor))
            : null
        }
      >
        {props.icon && (
          <FontAwesomeIcon icon={props.icon as any} className="mr-3" />
        )}
        {props.children || props.name}
      </a>
    </li>
  );
}
