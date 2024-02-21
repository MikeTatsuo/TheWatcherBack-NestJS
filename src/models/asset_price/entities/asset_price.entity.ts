import { IsDate, IsInt, Min } from '@nestjs/class-validator';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from '@nestjs/class-transformer';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';
import { ValuesEntity } from '@/models/values/entities/values.entity';

@Entity('asset_price')
export class AssetPriceEntity extends AbstractEntity {
  @Column({ type: 'timestamp' })
  @IsDate()
  date: Date;

  @ManyToOne(() => ValuesEntity, (value) => value.id)
  @JoinColumn([{ name: 'value_id', referencedColumnName: 'id' }])
  value: ValuesEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  value_id: number;
}
