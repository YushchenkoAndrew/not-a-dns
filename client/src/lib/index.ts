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

  static toQuery(obj: ObjectLiteral) {
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
