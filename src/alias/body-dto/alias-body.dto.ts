import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { AliasLinksBodyDto } from './alias-links-body.dto';

export class AliasBodyDto {
  @IsOptional()
  name: string;

  @IsDefined()
  @IsNotEmpty()
  alias: string;

  @IsDefined()
  @IsNotEmpty()
  value: string;

  @IsOptional()
  @IsBoolean()
  favorite: boolean = false;

  @IsOptional()
  @IsBoolean()
  secret: boolean = false;

  @IsDefined()
  @ValidateNested()
  @Type(() => AliasLinksBodyDto)
  parent: AliasLinksBodyDto;
}
