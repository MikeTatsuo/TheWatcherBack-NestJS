import { IsInt, IsNumber, Min } from '@nestjs/class-validator';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from '@nestjs/class-transformer';

import { ColumnNumericTransformer } from '@/common/serializers/validation/column_numeric.transformer';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';
import { AssetsEntity } from '@/models/assets/entities/assets.entity';

@Entity('values')
export class ValuesEntity extends AbstractEntity {
  @Column('decimal', {
    transformer: new ColumnNumericTransformer(),
  })
  @IsNumber()
  value: number;

  @Column({ nullable: true })
  @IsNumber()
  qtd: number;

  @ManyToOne(() => AssetsEntity, (asset) => asset.id)
  @JoinColumn([{ name: 'asset_id', referencedColumnName: 'id' }])
  asset: AssetsEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  asset_id: number;
}
