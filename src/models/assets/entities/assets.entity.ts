import { IsInt, IsString, Min } from '@nestjs/class-validator';
import { Exclude } from '@nestjs/class-transformer';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';
import { AssetTypeEntity } from '@/models/asset_type/entities/asset_type.entity';

@Entity('assets')
export class AssetsEntity extends AbstractEntity {
  @Column()
  @IsString()
  ticker: string;

  @Column()
  @IsString()
  asset: string;

  @ManyToOne(() => AssetTypeEntity, (asset_type) => asset_type.id)
  @JoinColumn([{ name: 'asset_type_id', referencedColumnName: 'id' }])
  asset_type: AssetTypeEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  asset_type_id: number;
}
