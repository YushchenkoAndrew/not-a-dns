import 'reflect-metadata';

export enum RequestPropKey {
  type = 'REQUEST',
  props = 'REQUEST_PROPS',
  // defined = 'COLUMN_DEFINED',
  // keys = 'COLUMN_KEYS',
}

export class RequestProps {
  constructor(init?: Partial<RequestProps>) {
    for (const k in init || {}) this[k] = init[k];
  }

  /**
   * Default route to send all request
   */
  route: string;

  /**
   * Default route to send all request
   */
  id: string;

  /**
   * Default action event name
   */
  action: Partial<{
    select: string;
    findOne: string;
    save: string;
    delete: string;
  }>;
}

export function RequestEntity(props?: Partial<RequestProps>) {
  return function (target: any) {
    const set = (flag: RequestPropKey, value: any) =>
      Reflect.defineMetadata(flag, value, target.prototype);

    set(RequestPropKey.type, true);
    set(RequestPropKey.props, new RequestProps(props));
  };
}
