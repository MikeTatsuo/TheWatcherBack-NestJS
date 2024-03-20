import { ApiProperty } from '@nestjs/swagger';

export class BrokerageNoteDTO {
  @ApiProperty({ type: 'number' })
  account_id: number;

  @ApiProperty({ type: 'string', format: 'date-time' })
  date: Date;
}
