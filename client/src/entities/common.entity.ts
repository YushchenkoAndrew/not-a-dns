import { EntityPropKey } from '../decorators/entity-property';

export abstract class CommonEntity {
  id: string;

  protected assign<T extends CommonEntity>(src: Partial<T>, dst: T) {
    for (const k in src || {}) {
      const enabled = Reflect.getMetadata(
        EntityPropKey.enabled,
        this.constructor.prototype,
        k,
      );

      if (!enabled) continue;
      dst[k] = src?.[k];
    }
  }
}
