import { ApiProperty } from '@nestjs/swagger';

export class AccountTypeDTO {
  @ApiProperty({ type: 'string' })
  account_type: string;
}
