import 'reflect-metadata';

import { ResponsePropKey } from '../decorators/response-property';

export abstract class CommonResponseDto {
  protected EXCLUDE: string[] = [];

  protected assign<T extends CommonResponseDto>(src: Partial<T>, dst: T) {
    for (const k in src || {}) {
      if (this.EXCLUDE.includes(k)) continue;
      const enabled = Reflect.getMetadata(
        ResponsePropKey.enabled,
        this.constructor.prototype,
        k,
      );

      if (!enabled) continue;
      if (typeof src[k] != 'object') dst[k] = src[k];
      const type = Reflect.getMetadata(
        ResponsePropKey.type,
        this.constructor.prototype,
        k,
      );

      if (typeof type != 'object') {
        dst[k] = src[k];
        continue;
      }

      if (Array.isArray(type)) {
        dst[k] = src[k].map((item) => {
          // NOTE: Here used class CommonEntity
          const res = new type[0].prototype.constructor();
          res.assign(item, res);
          return res;
        });
      } else {
        // NOTE: Here used class CommonEntity
        dst[k] = new type.prototype.constructor();
        dst[k].assign(src[k], dst[k]);
      }
    }
  }
}
