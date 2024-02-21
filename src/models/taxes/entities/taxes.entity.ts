import { IsInt, Min } from '@nestjs/class-validator';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from '@nestjs/class-transformer';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';
import { ValuesEntity } from '@/models/values/entities/values.entity';
import { OperationsEntity } from '@/models/operations/entities/operations.entity';
import { TaxTypeEntity } from '@/models/tax_type/entities/tax_type.entity';

@Entity('taxes')
export class TaxesEntity extends AbstractEntity {
  @ManyToOne(() => TaxTypeEntity, (tax_type) => tax_type.id)
  @JoinColumn([{ name: 'tax_type_id', referencedColumnName: 'id' }])
  tax_type: TaxTypeEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  tax_type_id: number;

  @ManyToOne(() => ValuesEntity, (value) => value.id)
  @JoinColumn([{ name: 'value_id', referencedColumnName: 'id' }])
  value: ValuesEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  value_id: number;

  @ManyToOne(() => OperationsEntity, (operation) => operation.id)
  @JoinColumn([{ name: 'operation_id', referencedColumnName: 'id' }])
  operation: OperationsEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  operation_id: number;
}
