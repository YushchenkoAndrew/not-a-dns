import { ResponseProperty } from '../../common/decorators/response-property';
import { CommonResponseDto } from '../../common/response-dto/common-response.dto';
import { LinksResponseDto } from '../../links/response-dto/links-response.dto';
import { AliasResponseDto } from './alias-response.dto';

export class AliasLinksResponseDto extends CommonResponseDto {
  @ResponseProperty((e) => new AliasResponseDto().buildAll(e.alias))
  alias: AliasResponseDto[] = [];

  @ResponseProperty((e) =>
    new LinksResponseDto().buildAll(
      e?.alias_link.map((e) => e?.linkable_links).filter((item) => item),
    ),
  )
  links: LinksResponseDto[] = [];
}
