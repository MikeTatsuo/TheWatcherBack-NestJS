import { IsString } from '@nestjs/class-validator';
import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';

@Entity('asset_type')
export class AssetTypeEntity extends AbstractEntity {
  @Column()
  @IsString()
  asset_type: string;
}
