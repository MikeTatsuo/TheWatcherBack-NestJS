import { IsString } from '@nestjs/class-validator';
import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';

@Entity('country')
export class CountryEntity extends AbstractEntity {
  @Column()
  @IsString()
  code: string;

  @Column()
  @IsString()
  country: string;
}
