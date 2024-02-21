import { ApiProperty } from '@nestjs/swagger';

export class OperationTypeDTO {
  @ApiProperty({ type: 'string' })
  operation_code: string;

  @ApiProperty({ type: 'string' })
  operation_type: string;

  @ApiProperty({ type: 'number' })
  in_operation_type_id: number;

  @ApiProperty({ type: 'number' })
  in_registry_id: number;
}
