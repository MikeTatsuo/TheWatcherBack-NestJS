import { ValuesDTO } from '@/models/values/interfaces/values.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AssetPriceDTO extends ValuesDTO {
  @ApiProperty({ type: 'string', format: 'date-time' })
  date: Date;
}
