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
      dst[k] = src[k];
    }
  }
}
