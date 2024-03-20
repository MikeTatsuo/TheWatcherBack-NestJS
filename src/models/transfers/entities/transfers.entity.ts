import { IsInt, Min } from '@nestjs/class-validator';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from '@nestjs/class-transformer';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';
import { OperationsEntity } from '@/models/operations/entities/operations.entity';

@Entity('transfers')
export class TransfersEntity extends AbstractEntity {
  @ManyToOne(() => OperationsEntity, (operation) => operation.id)
  @JoinColumn([{ name: 'operation_out_id', referencedColumnName: 'id' }])
  operation_out: OperationsEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  operation_out_id: number;

  @ManyToOne(() => OperationsEntity, (operation) => operation.id)
  @JoinColumn([{ name: 'operation_in_id', referencedColumnName: 'id' }])
  operation_in: OperationsEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  operation_in_id: number;
}
