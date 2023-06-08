import { API_URL } from '../config';
import { ObjectLiteral } from '../types';

export class StringService {
  static capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static humanize(str: string, sep: string = '_') {
    const [word, ...sentence] = str.split(sep);
    return [this.capitalize(word), ...sentence].join(' ');
  }

  static toSection(name: string): string {
    return name.replace(/ /g, '_').replace(/\//g, '').toLowerCase();
  }

  static route(str: string) {
    return str.replace(/\/$/, '');
  }

  static toQuery(obj: ObjectLiteral = {}) {
    const params = [] as string[];

    for (var p in obj) {
      if (!obj.hasOwnProperty(p)) continue;
      params.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }

    return params.join('&');
  }

  static errToMsg(err: Error) {
    // console.log(err);
    // return  'Request error';
    return err.message;
  }
}

export class ArrayService {
  static isEqual<T>(a: T[], b: T[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    return a.reduce((acc, curr, i) => acc && curr == b[i], true);
  }
}

export class ErrorService {
  static validate(res: Response) {
    if (res.ok) return;
    throw new Error(
      `HTTP  status code: ${res.status}; '${res.url.replace(API_URL, '')}'`,
    );
  }
}

export class ObjectService {
  static keys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as any;
  }
}
