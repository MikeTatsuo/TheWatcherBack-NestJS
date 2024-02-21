import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({ type: 'string' })
  username: string;

  @ApiProperty({ type: 'string' })
  password: string;

  @ApiProperty({ type: 'string' })
  token: string;
}
