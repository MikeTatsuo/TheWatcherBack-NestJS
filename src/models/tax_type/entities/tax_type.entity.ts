import { IsString } from '@nestjs/class-validator';
import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';

@Entity('tax_type')
export class TaxTypeEntity extends AbstractEntity {
  @Column()
  @IsString()
  tax_type: string;
}
