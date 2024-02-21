import { ApiProperty } from '@nestjs/swagger';

export class AssetTypeDTO {
  @ApiProperty({ type: 'string' })
  asset_type: string;
}
