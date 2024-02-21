import { IsString } from '@nestjs/class-validator';
import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';

@Entity('institution_type')
export class InstitutionTypeEntity extends AbstractEntity {
  @Column()
  @IsString()
  institution_type: string;
}
