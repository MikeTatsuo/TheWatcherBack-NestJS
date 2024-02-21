import { ApiProperty } from '@nestjs/swagger';

export class BalanceByAccountDTO {
  @ApiProperty({ type: 'number' })
  id: number;

  @ApiProperty({ type: 'string' })
  ticker: string;

  @ApiProperty({ type: 'string' })
  asset: string;

  @ApiProperty({ type: 'string' })
  value: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  date: Date;
}
