import { IsInt, IsString, Min } from '@nestjs/class-validator';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from '@nestjs/class-transformer';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';
import { InstitutionEntity } from '@/models/institution/entities/institution.entity';
import { AccountTypeEntity } from '@/models/account_type/entities/account_type.entity';

@Entity('account')
export class AccountEntity extends AbstractEntity {
  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  hash: string;

  @ManyToOne(() => InstitutionEntity, (institution) => institution.id, { eager: true })
  @JoinColumn([{ name: 'institution_id', referencedColumnName: 'id' }])
  institution: InstitutionEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  institution_id: number;

  @ManyToOne(() => AccountTypeEntity, (account_type) => account_type.id, { eager: true })
  @JoinColumn([{ name: 'account_type_id', referencedColumnName: 'id' }])
  account_type: AccountTypeEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  account_type_id: number;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  user_id: number;
}
