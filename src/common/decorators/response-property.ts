import 'reflect-metadata';

export enum ResponsePropKey {
  type = 'RESPONSE',
  defined = 'RESPONSE_DEFINED',
}

export function ResponseProperty(transformer?: (entity: any) => any) {
  return function (target: any, key: string) {
    const set = (flag: ResponsePropKey, value: any) =>
      Reflect.defineMetadata(flag, value, target, key);

    set(ResponsePropKey.type, transformer ?? true);
  };
}
