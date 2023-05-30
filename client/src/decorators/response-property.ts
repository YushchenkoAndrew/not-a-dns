import 'reflect-metadata';

interface ResponsePropertyProps {
  type: object;
}

export enum ResponsePropKey {
  enabled = 'RESPONSE',
  key = 'RESPONSE/KEY',
  type = 'RESPONSE/TYPE',
}

export function ResponseProperty(props?: ResponsePropertyProps) {
  return function (target: any, key: string) {
    // Reflect.defineMetadata(ResponsePropKey.enabled, true, target, key);
    // Reflect.defineMetadata(ResponsePropKey.key, key, target, key);
    Reflect.defineMetadata(
      ResponsePropKey.enabled,
      props?.type ?? true,
      target,
      key,
    );
  };
}
