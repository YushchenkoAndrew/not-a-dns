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
}

export function RequestEntity(props?: Partial<RequestProps>) {
  return function (target: any) {
    const set = (flag: RequestPropKey, value: any) =>
      Reflect.defineMetadata(flag, value, target.prototype);

    set(RequestPropKey.type, true);
    set(RequestPropKey.props, new RequestProps(props));
  };
}
