import { ApiProperty } from '@nestjs/swagger';

export class InstitutionDTO {
  @ApiProperty({ type: 'string' })
  institution: string;

  @ApiProperty({ type: 'number' })
  institution_type_id: number;

  @ApiProperty({ type: 'number' })
  country_id: number;

  @ApiProperty({ type: 'string' })
  url: string;
}
