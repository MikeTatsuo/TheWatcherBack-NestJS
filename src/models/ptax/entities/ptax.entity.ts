import { IsDate, IsInt, Min } from '@nestjs/class-validator';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from '@nestjs/class-transformer';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';
import { ValuesEntity } from '@/models/values/entities/values.entity';

@Entity('ptax')
export class PtaxEntity extends AbstractEntity {
  @Column({ type: 'timestamp' })
  @IsDate()
  date: Date;

  @ManyToOne(() => ValuesEntity, (value) => value.id)
  @JoinColumn([{ name: 'value_buy_id', referencedColumnName: 'id' }])
  value_buy: ValuesEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  value_buy_id: number;

  @ManyToOne(() => ValuesEntity, (value) => value.id)
  @JoinColumn([{ name: 'value_sell_id', referencedColumnName: 'id' }])
  value_sell: ValuesEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  value_sell_id: number;
}
