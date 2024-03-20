import { ApiProperty } from '@nestjs/swagger';

export class TransfersDTO {
  @ApiProperty({ type: 'number' })
  qtd: number;

  @ApiProperty({ type: 'number' })
  asset_id: number;

  @ApiProperty({ type: 'number' })
  operation_out_account_id: number;

  @ApiProperty({ type: 'timestamptz' })
  operation_out_date: Date;

  @ApiProperty({ type: 'number' })
  operation_out_ni_type: number;

  @ApiProperty({ type: 'number' })
  operation_in_account_id: number;

  @ApiProperty({ type: 'timestamptz' })
  operation_in_date: Date;

  @ApiProperty({ type: 'number' })
  operation_in_ni_type: number;
}
