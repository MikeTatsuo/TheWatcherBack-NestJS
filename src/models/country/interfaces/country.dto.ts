import { ApiProperty } from '@nestjs/swagger';

export class CountryDTO {
  @ApiProperty({ type: 'string' })
  code: string;

  @ApiProperty({ type: 'string' })
  country: string;
}
