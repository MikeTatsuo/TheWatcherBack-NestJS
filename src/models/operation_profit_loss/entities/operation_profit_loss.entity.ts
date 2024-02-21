import { IsInt, Min } from '@nestjs/class-validator';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from '@nestjs/class-transformer';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';
import { OperationsEntity } from '@/models/operations/entities/operations.entity';
import { ValuesEntity } from '@/models/values/entities/values.entity';

@Entity('operation_profit_loss')
export class OperationProfitLossEntity extends AbstractEntity {
  @ManyToOne(() => OperationsEntity, (operation) => operation.id)
  @JoinColumn([{ name: 'operation_id', referencedColumnName: 'id' }])
  operation: OperationsEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  operation_id: number;

  @ManyToOne(() => ValuesEntity, (value) => value.id)
  @JoinColumn([{ name: 'value_id', referencedColumnName: 'id' }])
  value: ValuesEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  value_id: number;
}
