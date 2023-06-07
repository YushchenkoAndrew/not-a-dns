import 'reflect-metadata';

import {
  ResponsePropKey,
  ResponseProps,
} from '../decorators/response-property';
import { ObjectLiteral } from '../types';

export class CommonResponseDto {
  // static assign<T extends CommonResponseDto>(src: Partial<T>, dst: T) {
  //   const get = (type: ResponsePropKey, key: string) =>
  //     Reflect.getMetadata(type, dst.constructor.prototype, key);

  //   for (const k in src || {}) {
  //     const type = get(ResponsePropKey.type, k);
  //     const isArray = get(ResponsePropKey.isArray, k);

  //     if (!type) continue;
  //     if (typeof src[k] != 'object' || typeof type != 'object') {
  //       dst[k] = src[k];
  //       continue;
  //     }

  //     if (isArray) {
  //       dst[k] = src[k].map((item) =>
  //         this.assign(item, new type.constructor()),
  //       );
  //     } else dst[k] = this.assign(src[k], new type.constructor());
  //   }

  //   return dst;
  // }

  assign<T extends CommonResponseDto>(src: Partial<T>, dst: T) {
    for (const k in src || {}) {
      const enabled = this.getGlobal(ResponsePropKey.type, k);

      if (!enabled) continue;
      dst[k] = src[k];
      this.setLocal(ResponsePropKey.defined, true, k);
    }

    return dst;
  }

  build<T>(entity: T): this {
    if (!entity) return null;
    // const res = new (this as any).constructor();

    for (const k of this.getGlobal(ResponsePropKey.keys) || []) {
      const transformer = this.getGlobal(ResponsePropKey.type, k);

      const defined = this.getLocal(ResponsePropKey.defined, k);
      if (defined) continue;

      if (typeof transformer !== 'function') {
        this[k] = entity[k as string];
        continue;
      }

      const props: ResponseProps = this.getGlobal(ResponsePropKey.props, k);

      this[k] =
        transformer(entity, new ResponseProps({ ...props, self: this })) ??
        props.default;
    }

    return this;
  }

  buildAll<T>(entities: T[]): this[] {
    return entities?.length
      ? entities.map((item) => this.newInstance(this.defined()).build(item))
      : [];
  }

  defined(): Partial<any> {
    const res = this.newInstance();

    for (const k in res) {
      const isDefined = this.getLocal(ResponsePropKey.defined, k);
      if (isDefined) res[k] = this[k];
      else delete res[k];
    }

    return res;
  }

  newInstance(props?: any): this {
    return new (this as any).constructor(props);
  }

  private getGlobal(type: ResponsePropKey, key?: string) {
    if (!key) return Reflect.getMetadata(type, this.constructor.prototype);
    return Reflect.getMetadata(type, this.constructor.prototype, key);
  }

  private getLocal(type: ResponsePropKey, key: string) {
    return Reflect.getMetadata(type, this, key);
  }

  private setLocal(type: ResponsePropKey, value: any, key: string) {
    return Reflect.defineMetadata(type, value, this, key);
  }

  private static _options: ObjectLiteral<ResponseProps>;
  static get options(): ObjectLiteral<ResponseProps> {
    const saved = this.prototype.constructor['_options'];
    if (saved) return saved;

    const options = {};
    const self = new (this.prototype.constructor as any)();

    for (const k of self.getGlobal(ResponsePropKey.keys) || []) {
      const props = self.getGlobal(ResponsePropKey.props, k);
      if (props) options[k] = props;
    }
    return (this.prototype.constructor['_options'] = options);
  }

  get options(): ObjectLiteral<ResponseProps> {
    return this.constructor['options'];
  }
}
