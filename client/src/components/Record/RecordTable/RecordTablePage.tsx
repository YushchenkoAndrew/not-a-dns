import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';

import { StoreT, useAppSelector } from '../../../redux/storage';
import { CommonPageResponseDto } from '../../../response-dto/common-page.response-dto';

export interface RecordTablePageProps<
  K extends keyof StoreT,
  V extends StoreT[K],
> {
  store: V extends Omit<CommonPageResponseDto, 'items'> ? K : never;
  onClick: (page: number) => void;

  pages?: number;
}

export default function RecordTablePage<
  K extends keyof StoreT,
  V extends StoreT[K],
>(props: RecordTablePageProps<K, V>) {
  const { page, per_page, total } = useAppSelector<CommonPageResponseDto>(
    (state) => state[props.store as string],
  );

  const [offset, changeOffset] = useState(0);
  useEffect(() => changeOffset(0), [page]);

  const { showItems, finalPage, pages } = useMemo(() => {
    const showItems = props.pages ?? 3;

    const finalPage = Math.ceil(total / per_page);
    const isFirst = !(page - 1);
    const isFinite = finalPage < showItems + +isFirst;

    const pages = new Array(isFinite ? finalPage : showItems)
      .fill(Math.floor((page - 1) / showItems) * showItems + offset + 1)
      .map((val, index) => index + val)
      .filter((item) => item <= finalPage);

    return { showItems, finalPage, pages };
  }, [offset, page, per_page, total]);

  return (
    <nav
      className="flex items-center justify-between pt-4"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing
        <span className="font-semibold mx-2 text-gray-900 dark:text-white">
          {`${(page - 1) * per_page + 1}-${Math.min(page * per_page, total)}`}
        </span>
        of
        <span className="font-semibold mx-2 text-gray-900 dark:text-white">
          {total}
        </span>
      </span>
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <a
            className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => props.onClick(1)}
          >
            <FontAwesomeIcon icon="angles-left" className="w-3 h-3" />
          </a>
        </li>

        <li>
          <a
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => (page - 1 < 1 ? null : props.onClick(page - 1))}
          >
            <FontAwesomeIcon icon="chevron-left" className="w-3 h-3" />
          </a>
        </li>

        {offset - showItems < -page + 1 ? (
          <></>
        ) : (
          <li>
            <a
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => changeOffset(offset - showItems)}
            >
              ...
            </a>
          </li>
        )}

        {pages.map((curr, index) => (
          <li key={index}>
            <a
              className={`px-3 py-2 leading-tight ${
                curr == page
                  ? 'text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
              onClick={() => props.onClick(curr)}
            >
              {curr}
            </a>
          </li>
        ))}
        {offset + showItems > finalPage - page + 1 ? (
          <></>
        ) : (
          <li>
            <a
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => changeOffset(offset + showItems)}
            >
              ...
            </a>
          </li>
        )}

        <li>
          <a
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() =>
              page + 1 > finalPage ? null : props.onClick(page + 1)
            }
          >
            <FontAwesomeIcon icon="chevron-right" className="w-3 h-3" />
          </a>
        </li>
        <li>
          <a
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => props.onClick(finalPage)}
          >
            <FontAwesomeIcon icon="angles-right" className="w-3 h-3" />
          </a>
        </li>
      </ul>
    </nav>
  );
}
