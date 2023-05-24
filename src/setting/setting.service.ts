import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingService {
  getSettings() {
    return {
      types: ['general', 'navbar', 'sidebar'],
    };
  }

  getSettingByType(type: string) {
    return {
      general: {
        loaded: true,
        mode: { state: true, name: 'Dark Mode', icon: 'moon' },
      },

      navbar: {
        section: 'general',
        items: [
          { name: '/mortis-greamreaper', href: 'home', target: '_blank' },
          { name: '/grape', href: 'test', target: '_blank' },
          { name: '/void', href: 't', target: '_blank' },
          { name: '/botodachi', href: 't', target: '_blank' },
        ],
      },

      sidebar: {
        items: [
          { name: 'General', icon: 'gear', anchor: 'general' },
          { name: 'records', anchor: 'records', chapter_id: 'temp#id1' },
        ],

        chapters: {
          'temp#id1': [
            { name: 'A Records', icon: 'circle', anchor: 'a_record' },
            { name: 'AAAA Records', icon: 'circle', anchor: '' },
            { name: 'CNAME Records', icon: 'circle', anchor: '' },
            { name: 'PTR Records', icon: 'circle', anchor: '' },
            { name: 'MX Records', icon: 'circle', anchor: '' },
            { name: 'TXT Records', icon: 'circle', anchor: '' },
          ],
        },
      },
    }[type];
  }
}
