import { IsInt, IsString, Min } from '@nestjs/class-validator';
import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';

@Entity('operation_type')
export class OperationTypeEntity extends AbstractEntity {
  @Column()
  @IsString()
  operation_code: string;

  @Column()
  @IsString()
  operation_type: string;

  @Column()
  @IsInt()
  @Min(1)
  in_operation_type_id: number;

  @Column()
  @IsInt()
  @Min(1)
  in_registry_id: number;
}
