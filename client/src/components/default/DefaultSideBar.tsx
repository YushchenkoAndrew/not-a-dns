import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { generalStore } from '../../redux/reducer/general.reducer';

import { useAppDispatch, useAppSelector } from '../../redux/storage';
import SideBar from '../SideBar/SideBar';
import SideBarChapter from '../SideBar/SideBarChapter.';
import SideBarItem from '../SideBar/SideBarItem';

export interface DefaultSideBarProps {
  children: ReactNode;
}

export default function DefaultSideBar(props: DefaultSideBarProps) {
  const { mode, res } = useAppSelector((state) => state.general);
  const dispatch = useAppDispatch();

  return (
    <SideBar>
      <SideBarItem name="General" anchor="general">
        <div className="group-hover:text-blue-600 dark:group-hover:text-yellow-200">
          <FontAwesomeIcon icon="gear" className="dar mr-3" />
          {mode.name}
        </div>
      </SideBarItem>

      {props.children}

      <SideBarChapter name="settings">
        <SideBarItem
          name=""
          anchor=""
          onClick={() => (
            dispatch(generalStore.actions.invertMode()),
            dispatch(res.save({ mode: !mode.state }))
          )}
        >
          <div className="group-hover:text-blue-600 dark:group-hover:text-yellow-200">
            <FontAwesomeIcon icon={mode.icon as any} className="dar mr-3" />
            {mode.name}
          </div>
        </SideBarItem>
      </SideBarChapter>
    </SideBar>
  );
}
