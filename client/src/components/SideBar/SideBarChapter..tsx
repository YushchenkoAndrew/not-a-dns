import { isSideBarChapter } from '../../redux/reducer/sidebar';
import { useAppSelector } from '../../redux/storage';
import SideBarItem from './SideBarItem';

export interface SideBarChapterProps {
  name: string;
  chapter_id: string;
}

export default function SideBarChapter(props: SideBarChapterProps) {
  const items = useAppSelector(
    (state) => state.sidebar.chapters[props.chapter_id],
  );

  return (
    <>
      <hr className="mb-1 mt-4 border-gray-200" />
      <li className="px-3">
        <p className="mt-3 mb-1 font-semibold text-gray-900 dark:text-gray-50">
          {props.name}
        </p>
      </li>

      <li className="pl-2 flex flex-col">
        {items.map((props, index) =>
          isSideBarChapter(props) ? (
            <SideBarChapter key={index} {...props} />
          ) : (
            <SideBarItem key={index} {...props} />
          ),
        )}
      </li>
    </>
  );
}
