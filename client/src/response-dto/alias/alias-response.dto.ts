import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import { ResponseProperty } from '../../decorators/response-property';
import { CommonResponseDto } from '../common.response-dto';
import { AliasLinksResponseDto } from './alias-links-response.dto';

export class AliasResponseDto extends CommonResponseDto {
  @ResponseProperty({ hidden: true })
  id: string;

  @ResponseProperty({ hidden: true })
  updated_at: string;

  @ResponseProperty({ index: 2, className: 'w-min', default: '' })
  name: string;

  @ResponseProperty({ index: 3, className: 'w-min' })
  alias: string;

  @ResponseProperty({ index: 4, className: 'w-min' })
  value: string;

  @ResponseProperty({
    index: 1,
    className: 'w-min',
    icon: { true: faStar, false: farStar },
  })
  favorite: boolean;

  @ResponseProperty({ hidden: true })
  secrete: boolean;

  @ResponseProperty((e) => new AliasLinksResponseDto().build(e.children), {
    hidden: true,
    related: true,
  })
  children: AliasLinksResponseDto;

  @ResponseProperty((e) => new AliasLinksResponseDto().build(e.parent), {
    hidden: true,
    related: true,
  })
  parent: AliasLinksResponseDto;
}
