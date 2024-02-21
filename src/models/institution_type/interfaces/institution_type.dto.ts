import { ApiProperty } from '@nestjs/swagger';

export class InstitutionTypeDTO {
  @ApiProperty({ type: 'string' })
  institution_type: string;
}
