import { FindOptionsWhere } from 'typeorm';

export type ObjectLiteral<T = any> = { [name: string]: T };

export type TreeOptions<T> = { where: FindOptionsWhere<T> } | { ids: number[] };
