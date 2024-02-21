import { ApiProperty } from '@nestjs/swagger';

export class INOperationTypeDTO {
  @ApiProperty({ type: 'string' })
  in_operation: string;

  @ApiProperty({ type: 'string' })
  in_operation_code: string;
}
