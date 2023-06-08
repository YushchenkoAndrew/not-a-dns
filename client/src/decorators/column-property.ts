import 'reflect-metadata';

import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { CommonEntity } from '../entities/common.entity';

export enum ColumnPropKey {
  type = 'COLUMN',
  props = 'COLUMN_PROPS',
  defined = 'COLUMN_DEFINED',
  keys = 'COLUMN_KEYS',
}

export class ColumnProps {
  constructor(init?: Partial<ColumnProps>) {
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
   * If set then it will be required aka not empty
   */
  required: true;

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

type TransformerT = (entity: any, props: ColumnProps) => any;
type PropsT = Partial<Omit<ColumnProps, 'self' | 'key'>>;

export function ColumnProperty(
  transformer?: TransformerT | PropsT,
  props?: PropsT,
) {
  return function (target: any, key: string) {
    const set = (flag: ColumnPropKey, value: any) =>
      Reflect.defineMetadata(flag, value, target, key);

    const keys = Reflect.getMetadata(ColumnPropKey.keys, target) || [];
    Reflect.defineMetadata(ColumnPropKey.keys, [...keys, key], target);

    if (typeof transformer == 'function' || typeof transformer == 'undefined') {
      set(ColumnPropKey.type, transformer ?? true);
      set(ColumnPropKey.props, new ColumnProps({ ...(props || {}), key }));
      return;
    }

    set(ColumnPropKey.type, true);
    set(ColumnPropKey.props, new ColumnProps({ ...transformer, key }));
  };
}
