import { IsDate, IsInt, Min } from '@nestjs/class-validator';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from '@nestjs/class-transformer';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';
import { AccountEntity } from '@/models/account/entities/account.entity';
import { OperationsEntity } from '@/models/operations/entities/operations.entity';
import { ValuesEntity } from '@/models/values/entities/values.entity';

@Entity('balance')
export class BalanceEntity extends AbstractEntity {
  @Column({ type: 'timestamptz' })
  @IsDate()
  date: Date;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: AccountEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  account_id: number;

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
