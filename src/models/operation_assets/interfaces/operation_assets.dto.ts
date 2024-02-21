import { ApiProperty } from '@nestjs/swagger';

export class OperationAssetsDTO {
  @ApiProperty({ type: 'number' })
  operation_id: number;

  @ApiProperty({ type: 'number' })
  value_id: number;
}
