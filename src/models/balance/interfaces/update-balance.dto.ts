import { ApiProperty } from '@nestjs/swagger';

export class UpdateBalanceDTO {
  @ApiProperty({ type: 'number' })
  operation_id: number;

  @ApiProperty({ type: 'number' })
  account_id: number;

  @ApiProperty({ type: 'number' })
  asset_id: number;

  @ApiProperty({ type: 'number' })
  value: number;

  @ApiProperty({ type: 'string', format: 'date-time' })
  date: Date;

  @ApiProperty({ type: 'boolean' })
  add: boolean;
}
