import 'reflect-metadata';

import { ResponsePropKey } from '../decorators/response-property';

export class CommonResponseDto {
  static assign<T extends CommonResponseDto>(src: Partial<T>, dst: T) {
    for (const k in src || {}) {
      const type = Reflect.getMetadata(
        ResponsePropKey.enabled,
        dst.constructor.prototype,
        k,
      );

      if (!type) continue;
      if (typeof src[k] != 'object' || typeof type != 'object') {
        dst[k] = src[k];
        continue;
      }

      if (Array.isArray(type)) {
        dst[k] = src[k].map((item) =>
          this.assign(item, new type[0].prototype.constructor()),
        );
      } else dst[k] = this.assign(src[k], new type.prototype.constructor());
    }

    return dst;
  }
}
