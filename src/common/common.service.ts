import { ObjectLiteral } from '../../client/src/types';

export class ArrayService {
  static values<T>(arr: T[]): T[] {
    if (arr?.length) return arr;
    return [null];
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
