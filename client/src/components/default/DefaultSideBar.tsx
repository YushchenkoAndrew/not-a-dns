import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { generalStore } from '../../redux/reducer/general';
import { useAppDispatch, useAppSelector } from '../../redux/storage';
import SideBarChapter from '../SideBar/SideBarChapter.';
import SideBarItem from '../SideBar/SideBarItem';

export interface DefaultSideBarProps {}

export default function DefaultSideBar(props: DefaultSideBarProps) {
  const mode = useAppSelector((state) => state.general.mode);
  const dispatch = useAppDispatch();

  return (
    <SideBarChapter name="settings">
      <SideBarItem
        name=""
        anchor=""
        onClick={() => dispatch(generalStore.actions.invertMode())}
      >
        <div className="group-hover:text-blue-600 dark:group-hover:text-yellow-200">
          <FontAwesomeIcon icon={mode.icon as any} className="dar mr-3" />
          {mode.name}
        </div>
      </SideBarItem>
    </SideBarChapter>
  );
}
