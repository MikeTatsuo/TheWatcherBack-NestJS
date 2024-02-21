import { ApiProperty } from '@nestjs/swagger';

export class NiTypeDTO {
  @ApiProperty({
    type: 'string',
  })
  ni_type: string;

  @ApiProperty({
    type: 'number',
  })
  ni_code: number;
}
