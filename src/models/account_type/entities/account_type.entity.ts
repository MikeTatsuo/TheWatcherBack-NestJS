import { IsString } from '@nestjs/class-validator';
import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';

@Entity('account_type')
export class AccountTypeEntity extends AbstractEntity {
  @Column()
  @IsString()
  account_type: string;
}
