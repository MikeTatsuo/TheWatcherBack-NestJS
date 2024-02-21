import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

import { Order } from '@/common/enums/order.enum';

export class PaginationOptionsDTO {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 500,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  @IsOptional()
  readonly per_page?: number = 10;

  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({ default: 'id' })
  @IsString()
  @IsOptional()
  readonly order_by?: string = 'id';

  get skip(): number {
    return (this.page - 1) * this.per_page;
  }
}
