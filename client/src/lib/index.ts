export class StringService {
  static capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static toSection(name: string): string {
    return name.replace(/ /g, '_').replace(/\//g, '').toLowerCase();
  }
}
