import { IsArray, IsDefined } from 'class-validator';

export class AliasLinksBodyDto {
  @IsDefined()
  @IsArray()
  alias: string[] = [];

  // NOTE: Not supported for now
  // @IsDefined()
  // @IsArray()
  // links: string[] = [];
}
