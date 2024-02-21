import { IsNumber, IsString } from '@nestjs/class-validator';
import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';

@Entity('ni_type')
export class NiTypeEntity extends AbstractEntity {
  @Column()
  @IsString()
  ni_type: string;

  @Column()
  @IsNumber()
  ni_code: number;
}
