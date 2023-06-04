import { ArrayService } from '../../common/common.service';
import { ResponseProperty } from '../../common/decorators/response-property';
import { CommonResponseDto } from '../../common/response-dto/common-response.dto';
import { LinksResponseDto } from '../../links/response-dto/links-response.dto';
import { AliasEntity } from '../entities/alias.entity';
import { AliasLinksResponseDto } from './alias-links-response.dto';

export class AliasResponseDto extends CommonResponseDto {
  constructor(init?: Partial<AliasResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty((e) => e.nanoid)
  id: string = '';

  @ResponseProperty()
  name: string = '';

  @ResponseProperty((e: AliasEntity) => e.value || e.secret?.value || '')
  value: string = '';

  @ResponseProperty()
  favorite: boolean = false;

  @ResponseProperty((e: AliasEntity) => !!e.secret?.value)
  secrete: boolean = false;

  @ResponseProperty((e: AliasEntity) =>
    new AliasLinksResponseDto({
      alias: new AliasResponseDto({ parent: undefined }).buildAll(e.children),
      links: new LinksResponseDto({ parent: undefined }).buildAll(
        ArrayService.extractAndFilter(e.alias_link, 'linkable_links'),
      ),
    }).build(e),
  )
  children: AliasLinksResponseDto = null;

  @ResponseProperty(
    (e: AliasEntity) =>
      new AliasLinksResponseDto({
        alias: new AliasResponseDto({ parent: undefined }).buildAll(e.parent),
        // NOTE: For now paren relation with link is not supported
        // links: [],
      }),
  )
  parent: AliasLinksResponseDto = null;
}
