import { IsBoolean, IsOptional } from 'class-validator';

export class SettingsBodyDto {
  @IsOptional()
  @IsBoolean()
  mode: boolean;
}
