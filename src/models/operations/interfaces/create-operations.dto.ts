import { ApiProperty } from '@nestjs/swagger';

import { ValuesDTO } from '@/models/values/interfaces/values.dto';

import { OperationsDTO } from '@/models/operations/interfaces/operations.dto';

export class CreateOperationsDTO extends OperationsDTO {
  @ApiProperty({ type: ValuesDTO })
  value_in: ValuesDTO;

  @ApiProperty({ type: ValuesDTO })
  value_out: ValuesDTO;
}
