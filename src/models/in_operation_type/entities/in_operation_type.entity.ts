import { IsString } from '@nestjs/class-validator';
import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';

@Entity('in_operation_type')
export class INOperationTypeEntity extends AbstractEntity {
  @Column()
  @IsString()
  in_operation: string;

  @Column()
  @IsString()
  in_operation_code: string;
}
