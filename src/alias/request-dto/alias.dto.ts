import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

import { EnumService } from '../../common/common.service';
import { PageDto } from '../../common/request-dto/page.dto';
import { AliasViewEnum } from '../types/alias-view.enum';

export class AliasDto extends PageDto {
  @IsOptional()
  @Transform(({ value }) =>
    value ? `%${value.replace(/^\%+|\%+$/g, '')}%` : undefined,
  )
  query: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  favorite: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  secret: boolean;

  @IsOptional()
  @IsEnum(AliasViewEnum, {
    message: `view must be one of the following values: ${EnumService.keys(
      AliasViewEnum,
    ).join(', ')}`,
  })
  @Transform(({ value }) => AliasViewEnum[value])
  view: AliasViewEnum = AliasViewEnum.tree;
}
