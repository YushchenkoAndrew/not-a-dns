import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { AliasLinksBodyDto } from './alias-links-body.dto copy';

export class AliasBodyDto {
  @IsDefined()
  @IsNotEmpty()
  name: string;

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
