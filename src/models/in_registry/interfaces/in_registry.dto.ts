import { ApiProperty } from '@nestjs/swagger';

export class INRegistryDTO {
  @ApiProperty({ type: 'number' })
  registry_code: number;

  @ApiProperty({ type: 'number' })
  registry_hierarchy: number;

  @ApiProperty({ type: 'string' })
  description: string;
}
