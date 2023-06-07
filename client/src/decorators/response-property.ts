import 'reflect-metadata';

import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { CommonResponseDto } from '../response-dto/common.response-dto';

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
   * This value will be defined dynamically in {@link CommonResponseDto#build}
   */
  self: CommonResponseDto;

  /**
   * This variable contains current key name
   * This value will be defined dynamically in {@link CommonResponseDto#build}
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

  /**
   * Entity property
   * Will hide this field to user
   */
  hidden: true;

  /**
   * Entity property
   * If set then it will displayed in related block
   */
  related: true;

  /**
   * Entity property
   * Will show specified icon depends on a state
   */
  icon: { [state: string]: IconProp };

  /**
   * Entity property
   * Will show this value based on index
   */
  index: number;

  /**
   * Entity property
   * Will display column with the next width
   */
  className: string;
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
