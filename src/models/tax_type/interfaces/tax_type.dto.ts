import { ApiProperty } from '@nestjs/swagger';

export class TaxTypeDTO {
  @ApiProperty({ type: 'string' })
  tax_type: string;
}
