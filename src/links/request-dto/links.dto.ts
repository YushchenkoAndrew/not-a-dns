import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

import { EnumService } from '../../common/common.service';
import { PageDto } from '../../common/request-dto/page.dto';
import { LinksViewEnum } from '../types/links-view.enum';

export class LinksDto extends PageDto {
  constructor(init?: Partial<LinksDto>) {
    super();
    for (const k in init) this[k] = init[k];
  }

  @IsOptional()
  @Transform(({ value }) =>
    value ? `%${value.replace(/^\%+|\%+$/g, '')}%` : undefined,
  )
  query: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  favorite: boolean;

  @IsOptional()
  @IsEnum(LinksViewEnum, {
    message: `view must be one of the following values: ${EnumService.keys(
      LinksViewEnum,
    ).join(', ')}`,
  })
  @Transform(({ value }) => LinksViewEnum[value])
  view: LinksViewEnum = LinksViewEnum.tree;
}
