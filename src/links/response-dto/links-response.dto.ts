import { AliasLinksResponseDto } from '../../alias/response-dto/alias-links-response.dto';
import { AliasResponseDto } from '../../alias/response-dto/alias-response.dto';
import { ArrayService } from '../../common/common.service';
import { ResponseProperty } from '../../common/decorators/response-property';
import { CommonResponseDto } from '../../common/response-dto/common-response.dto';
import { LinksEntity } from '../entities/links.entity';

export class LinksResponseDto extends CommonResponseDto {
  constructor(init?: Partial<LinksResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty((e) => e.nanoid)
  id: string = '';

  @ResponseProperty()
  name: string = '';

  @ResponseProperty()
  url: string = '';

  @ResponseProperty()
  favorite: boolean = false;

  // NOTE: Not supported for now
  // @ResponseProperty((e: LinksEntity) =>
  //   new AliasLinksResponseDto({
  //     alias: new AliasResponseDto({ parent: undefined }).buildAll(
  //       ArrayService.extractAndFilter(e.alias_link, 'linkable_alias'),
  //     ),
  //     links: new LinksResponseDto({ parent: undefined }).buildAll(
  //       ArrayService.extractAndFilter(e.alias_link, 'linkable_links'),
  //     ),
  //   }).build(e),
  // )
  children: AliasLinksResponseDto = null;

  @ResponseProperty(
    (e: LinksEntity) =>
      new AliasLinksResponseDto({
        alias: new AliasResponseDto({ parent: undefined }).buildAll(
          ArrayService.extractAndFilter(e.alias_link, 'alias'),
        ),
        // NOTE: For now paren relation with link is not supported
        // links: [],
      }),
  )
  parent: AliasLinksResponseDto = null;
}
