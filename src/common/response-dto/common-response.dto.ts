import { ResponsePropKey } from '../decorators/response-property';

export class CommonResponseDto {
  assign<T extends CommonResponseDto>(src: Partial<T>, dst: T) {
    for (const k in src || {}) {
      const enabled = this.getGlobal(ResponsePropKey.type, k);

      if (!enabled) continue;
      dst[k] = src[k];
      this.setLocal(ResponsePropKey.defined, k, true);
    }

    return dst;
  }

  build<T>(entity: T): this {
    // const res = new (this as any).constructor();

    for (const k in this) {
      const transformer = this.getGlobal(ResponsePropKey.type, k);

      const defined = this.getLocal(ResponsePropKey.defined, k);
      if (defined) continue;

      if (typeof transformer !== 'function') this[k] = entity[k as string];
      else this[k] = transformer(entity);
    }

    return this;
  }

  buildAll<T>(entities: T[]): this[] {
    return entities?.length ? entities.map((item) => this.build(item)) : [];
  }

  private getGlobal(type: ResponsePropKey, key: string) {
    return Reflect.getMetadata(type, this.constructor.prototype, key);
  }

  private getLocal(type: ResponsePropKey, key: string) {
    return Reflect.getMetadata(type, this, key);
  }

  private setLocal(flag: ResponsePropKey, key: string, value: any) {
    return Reflect.defineMetadata(flag, value, this, key);
  }
}
