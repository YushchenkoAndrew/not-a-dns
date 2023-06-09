import { ObjectLiteral } from './types';

export class ArrayService {
  static values<T>(arr: T[]): T[] {
    if (arr?.length) return arr;
    return [null];
  }

  static unique<T>(arr: T[]): T[] {
    return Object.keys(
      arr.reduce((acc, curr) => ((acc[curr as string] = true), acc), {}),
    ) as T[];
  }

  static extract<T extends object, K extends keyof T>(
    arr: T[],
    key: K,
  ): T[K][] {
    return arr.reduce((acc, curr) => (acc.push(curr[key as string]), acc), []);
  }

  static extractAndFilter<T extends object, K extends keyof T>(
    arr: T[],
    key: K,
  ): T[K][] {
    return arr
      .reduce((acc, curr) => (acc.push(curr?.[key as string]), acc), [])
      .filter((item) => item);
  }
}

export class ObjectService {
  static toMap<T extends object, K extends keyof T>(
    arr: T[],
    key: K,
  ): ObjectLiteral<T> {
    return arr.reduce(
      (acc, curr) => ((acc[curr[key as string]] = curr), acc),
      {},
    );
  }
}

export class EnumService {
  static keys<T extends object>(obj: T) {
    return Object.keys(obj).filter((k) => isNaN(Number(k)));
  }
}
