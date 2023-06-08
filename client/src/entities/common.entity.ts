import { createAsyncThunk } from '@reduxjs/toolkit';
import 'reflect-metadata';
import { API_URL } from '../config';

import {
  ColumnPropKey,
  ColumnProps,
  ColumnProperty,
} from '../decorators/column-property';
import { RequestPropKey, RequestProps } from '../decorators/request-entity';
import {
  ResponsePropKey,
  ResponseProps,
  ResponseProperty,
} from '../decorators/response-property';
import { ErrorService, StringService } from '../lib';
import { ObjectLiteral } from '../types';

export class CommonEntity {
  assign<T extends CommonEntity>(src: Partial<T>, dst: T) {
    for (const k in src || {}) {
      const enabled = this.getGlobal(ResponsePropKey.type, k);

      if (!enabled) continue;
      dst[k] = src[k];
      this.setLocal(ResponsePropKey.defined, true, k);
    }

    return dst;
  }

  /**
   * This method will build response-dto/request-dto
   * @see {@link ResponseProperty}
   */
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

  /**
   * This method will build response-dto/request-dto
   * @see {@link ResponseProperty}
   */
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

  static get self(): CommonEntity {
    return new (this.prototype.constructor as any)();
  }

  /**
   * This method will return info about Column
   * @see {@link ColumnProperty}
   */
  static get columns(): ObjectLiteral<ColumnProps> {
    const saved = this.prototype.constructor['_columns'];
    if (saved) return saved;

    const options = {};
    for (const k of this.self.getGlobal(ColumnPropKey.keys) || []) {
      const props = this.self.getGlobal(ColumnPropKey.props, k);
      if (props) options[k] = props;
    }

    console.log(options);

    return (this.prototype.constructor['_columns'] = options);
  }

  // NOTE: Singleton
  private static _columns: ObjectLiteral<ColumnProps>;
  get columns(): ObjectLiteral<ColumnProps> {
    return this.constructor['columns'];
  }

  get select() {
    return createAsyncThunk('action/load', async (query?: ObjectLiteral) => {
      const options: RequestProps = this.getGlobal(RequestPropKey.props);
      if (!options) return null;

      return {
        options: query,
        res: this.newInstance().build(
          await fetch(
            `${API_URL}/${options.route}?${StringService.toQuery(query)}`,
          ).then((res) => (ErrorService.validate(res), res.json())),
        ),
      };
    });
  }

  get findOne() {
    return createAsyncThunk('action/load', async () => {
      const options: RequestProps = this.getGlobal(RequestPropKey.props);
      if (!options) return null;

      return this.newInstance().build(
        await fetch(
          StringService.route(
            `${API_URL}/${options.route}/${(this as any).id ?? ''}`,
          ),
        ).then((res) => (ErrorService.validate(res), res.json())),
      );
    });
  }

  get save() {
    return createAsyncThunk('action/upsert', async () => {
      const options: RequestProps = this.getGlobal(RequestPropKey.props);
      if (!options) return null;

      return this.newInstance().build(
        await fetch(
          StringService.route(
            `${API_URL}/${options.route}/${(this as any).id ?? ''}`,
          ),
          {
            method: (this as any).id ? 'POST' : 'PUT',
            body: JSON.stringify(this.newInstance().build(this)),
            headers: { 'Content-Type': 'application/json' },
          },
        ).then((res) => (ErrorService.validate(res), res.json())),
      );
    });
  }

  get delete() {
    return createAsyncThunk('action/delete', async () => {
      const options: RequestProps = this.getGlobal(RequestPropKey.props);
      if (!options) return null;

      return this.newInstance().build(
        await fetch(
          StringService.route(
            `${API_URL}/${options.route}/${(this as any).id ?? ''}`,
          ),
          { method: 'DELETE' },
        ).then((res) => (ErrorService.validate(res), res.json())),
      );
    });
  }

  protected getGlobal(type: string, key?: string) {
    if (!key) return Reflect.getMetadata(type, this.constructor.prototype);
    return Reflect.getMetadata(type, this.constructor.prototype, key);
  }

  protected getLocal(type: string, key: string) {
    return Reflect.getMetadata(type, this, key);
  }

  protected setLocal(type: string, value: any, key: string) {
    return Reflect.defineMetadata(type, value, this, key);
  }
}
