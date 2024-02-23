import { ApiProperty } from '@nestjs/swagger';

export class ValuesDTO {
  @ApiProperty({ type: 'number' })
  value: number;

  @ApiProperty({ type: 'number' })
  qtd: number;

  @ApiProperty({ type: 'number' })
  asset_id: number;
}
