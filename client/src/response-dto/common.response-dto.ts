import 'reflect-metadata';

import { ResponsePropKey } from '../decorators/response-property';

export class CommonResponseDto {
  static assign<T extends CommonResponseDto>(src: Partial<T>, dst: T) {
    const get = (type: ResponsePropKey, key: string) =>
      Reflect.getMetadata(type, dst.constructor.prototype, key);

    for (const k in src || {}) {
      const type = get(ResponsePropKey.type, k);
      const isArray = get(ResponsePropKey.isArray, k);

      if (!type) continue;
      if (typeof src[k] != 'object' || typeof type != 'object') {
        dst[k] = src[k];
        continue;
      }

      if (isArray) {
        dst[k] = src[k].map((item) =>
          this.assign(item, new type.constructor()),
        );
      } else dst[k] = this.assign(src[k], new type.constructor());
    }

    return dst;
  }
}
