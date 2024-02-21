import { ApiProperty } from '@nestjs/swagger';

export class TaxesDTO {
  @ApiProperty({ type: 'number' })
  tax_type_id: number;

  @ApiProperty({ type: 'number' })
  value: number;

  @ApiProperty({ type: 'number' })
  asset_id: number;

  @ApiProperty({ type: 'number' })
  operation_id: number;
}
