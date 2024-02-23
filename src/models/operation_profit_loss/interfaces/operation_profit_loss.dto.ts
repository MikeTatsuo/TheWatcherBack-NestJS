import { ApiProperty } from '@nestjs/swagger';

export class OperationProfitLossDTO {
  @ApiProperty({ type: 'number' })
  operation_id: number;

  @ApiProperty({ type: 'number' })
  asset_id: number;

  @ApiProperty({ type: 'number' })
  value: number;

  @ApiProperty({ type: 'number' })
  qtd: number;
}
