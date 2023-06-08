import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface RecordLabelProps {
  value: string;
  anchor?: string;
  onClick?: () => void;
}

export default function RecordLabel(props: RecordLabelProps) {
  return (
    <>
      <p className="group text-2xl font-bold my-2">
        <a
          className="text-gray-900 dark:text-white"
          // name={props.section}
          href={props.anchor ? `#${props.anchor}` : undefined}
          onClick={props.onClick}
        >
          {props.value}
        </a>
        <FontAwesomeIcon
          icon="link"
          className="ml-2 text-gray-600 dark:text-gray-400 invisible group-hover:visible"
        />
      </p>
    </>
  );
}
