import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { PaginationOptionsDTOParams } from '@/common/interfaces/pagination_options_dto_params.interface';

export class PaginationDTO<T> {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly perPage: number;

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  constructor(data: T[], { paginationOptions, total }: PaginationOptionsDTOParams) {
    this.data = data;
    this.page = paginationOptions.page;
    this.perPage = paginationOptions.per_page;
    this.total = total;
    this.pageCount = Math.ceil(this.total / this.perPage);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
