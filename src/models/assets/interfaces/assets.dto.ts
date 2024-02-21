import { ApiProperty } from '@nestjs/swagger';

export class AssetsDTO {
  @ApiProperty({ type: 'string' })
  ticker: string;

  @ApiProperty({ type: 'string' })
  asset: string;

  @ApiProperty({ type: 'number' })
  asset_type_id: number;
}
