import { Optional } from '@nestjs/common';
import { IsNumber } from 'class-validator';

export class PageDto {
  @Optional()
  @IsNumber()
  page: number = 1;

  @Optional()
  @IsNumber()
  per_page: number = 30;

  get skip(): number {
    return (this.page - 1) * this.per_page;
  }
}
