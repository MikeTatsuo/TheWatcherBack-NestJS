import { ApiProperty } from '@nestjs/swagger';

export class BalanceDTO {
  @ApiProperty({ type: 'number' })
  account_id: number;

  @ApiProperty({ type: 'number' })
  value_id: number;

  @ApiProperty({ type: 'string', format: 'date-time' })
  date: Date;

  @ApiProperty({ type: 'number' })
  operation_id: number;
}
