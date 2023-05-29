import 'reflect-metadata';

interface ResponsePropertyProps {
  type: object;
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
    if (!props) return;

    Reflect.defineMetadata(ResponsePropKey.type, props.type, target, key);
  };
}
