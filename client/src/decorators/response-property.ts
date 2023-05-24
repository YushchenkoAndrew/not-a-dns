import 'reflect-metadata';

interface ResponsePropertyProps {
  // type: 'string' | 'number' | 'object' | Number | Object;
}

export enum ResponsePropKey {
  enabled = 'res',
  key = 'res/key',
  type = 'res/type',
}

export function ResponseProperty(props?: ResponsePropertyProps) {
  return function (target: any, key: string) {
    Reflect.defineMetadata(ResponsePropKey.enabled, true, target, key);
    Reflect.defineMetadata(ResponsePropKey.key, key, target, key);
    //   Reflect.defineMetadata(
    //     ResponsePropKey.type,
    //     typeof props.type === 'string' ? props.type : typeof props.type,
    //     target,
    //     key,
    //   );
  };
}
