import { IsInt, IsString } from '@nestjs/class-validator';
import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';

@Entity('in_registry')
export class INRegistryEntity extends AbstractEntity {
  @Column()
  @IsInt()
  registry_code: number;

  @Column()
  @IsInt()
  registry_hierarchy: number;

  @Column()
  @IsString()
  description: string;
}
