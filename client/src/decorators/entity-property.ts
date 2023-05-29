import 'reflect-metadata';

interface EntityPropertyProps {
  // type: 'string' | 'number' | 'object' | Number | Object;
}

export enum EntityPropKey {
  enabled = 'entity',
  key = 'entity/key',
  type = 'entity/type',
}

export function EntityProperty(props?: EntityPropertyProps) {
  return function (target: any, key: string) {
    Reflect.defineMetadata(EntityPropKey.enabled, true, target, key);
    Reflect.defineMetadata(EntityPropKey.key, key, target, key);
    //   Reflect.defineMetadata(
    //     ResponsePropKey.type,
    //     typeof props.type === 'string' ? props.type : typeof props.type,
    //     target,
    //     key,
    //   );
  };
}
