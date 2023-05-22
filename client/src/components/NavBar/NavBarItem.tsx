export interface NavBarItemProps {
  href?: string;
  target?: string;
  name: string;
}

export default function NavBarItem(props: NavBarItemProps) {
  return (
    <li>
      <a
        className="block rounded py-2 text-gray-400 hover:text-gray-50"
        href={props.href ?? ''}
        target={props.target ?? '_self'}
        aria-current="page"
      >
        {props.name}
      </a>
    </li>
  );
}
