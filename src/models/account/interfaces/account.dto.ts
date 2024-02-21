import { ApiProperty } from '@nestjs/swagger';

export class AccountDTO {
  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'string' })
  hash: string;

  @ApiProperty({ type: 'number' })
  institution_id: number;

  @ApiProperty({ type: 'number' })
  account_type_id: number;
}
