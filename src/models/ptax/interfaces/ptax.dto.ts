import { ApiProperty } from '@nestjs/swagger';

export class PtaxDTO {
  @ApiProperty({ type: 'string', format: 'date-time' })
  date: Date;

  @ApiProperty({ type: 'number' })
  asset_id: number;

  @ApiProperty({ type: 'number' })
  value_buy: number;

  @ApiProperty({ type: 'number' })
  value_sell: number;
}
