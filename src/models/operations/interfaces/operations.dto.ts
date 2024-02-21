import { ApiProperty } from '@nestjs/swagger';

export class OperationsDTO {
  @ApiProperty({ type: 'number' })
  operation_type_id: number;

  @ApiProperty({ type: 'number' })
  account_id: number;

  @ApiProperty({ type: 'number' })
  ni_type_id: number;

  @ApiProperty({ type: 'string' })
  description: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  date: Date;
}
