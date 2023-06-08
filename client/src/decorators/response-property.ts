import 'reflect-metadata';

import { CommonEntity } from '../entities/common.entity';

export enum ResponsePropKey {
  type = 'RESPONSE',
  props = 'RESPONSE_PROPS',
  defined = 'RESPONSE_DEFINED',
  keys = 'RESPONSE_KEYS',
}

export class ResponseProps {
  constructor(init?: Partial<ResponseProps>) {
    for (const k in init || {}) this[k] = init[k];
  }

  /**
   * This variable contains current ```this```
   * This value will be defined dynamically in {@link CommonEntity#build}
   */
  self: CommonEntity;

  /**
   * This variable contains current key name
   * This value will be defined dynamically in {@link CommonEntity#build}
   */
  key: string;

  /**
   * Define default value that will be assigned if entity doesn't has requested
   * property, default values is ```null```
   */
  default: any = null;

  /**
   * If set to ```true``` then will overwrite property to {@link default} value
   */
  overwrite: true;
}

type TransformerT = (entity: any, props: ResponseProps) => any;
type PropsT = Partial<Omit<ResponseProps, 'self' | 'key'>>;

export function ResponseProperty(
  transformer?: TransformerT | PropsT,
  props?: PropsT,
) {
  return function (target: any, key: string) {
    const set = (flag: ResponsePropKey, value: any) =>
      Reflect.defineMetadata(flag, value, target, key);

    const keys = Reflect.getMetadata(ResponsePropKey.keys, target) || [];
    Reflect.defineMetadata(ResponsePropKey.keys, [...keys, key], target);

    if (typeof transformer == 'function' || typeof transformer == 'undefined') {
      set(ResponsePropKey.type, transformer ?? true);
      set(ResponsePropKey.props, new ResponseProps({ ...(props || {}), key }));
      return;
    }

    set(ResponsePropKey.type, true);
    set(ResponsePropKey.props, new ResponseProps({ ...transformer, key }));
  };
}
