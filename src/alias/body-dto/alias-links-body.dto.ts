import { IsArray, IsDefined } from 'class-validator';

export class AliasLinksBodyDto {
  // FIXME: Make it look like response dto !!!!!!
  @IsDefined()
  @IsArray()
  alias: string[] = [];

  // NOTE: Not supported for now
  // @IsDefined()
  // @IsArray()
  // links: string[] = [];
}
