import 'reflect-metadata';

interface ResponsePropertyProps {
  type?: object;
  isArray?: boolean;
  recursive?: boolean;
}

export enum ResponsePropKey {
  type = 'RESPONSE',
  isArray = 'RESPONSE_IS_ARRAY',
}

export function ResponseProperty(props?: ResponsePropertyProps) {
  return function (target: any, key: string) {
    const set = (flag: ResponsePropKey, value: any) =>
      Reflect.defineMetadata(flag, value, target, key);

    set(
      ResponsePropKey.type,
      props?.recursive ? target : (props?.type as any)?.prototype ?? true,
    );

    set(ResponsePropKey.isArray, props?.isArray ?? false);
  };
}
