import { IsDate, IsInt, Min } from '@nestjs/class-validator';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Exclude } from '@nestjs/class-transformer';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';
import { AccountEntity } from '@/models/account/entities/account.entity';
import { OperationsEntity } from '@/models/operations/entities/operations.entity';
import { TaxesEntity } from '@/models/taxes/entities/taxes.entity';

@Entity('brokerage_note')
export class BrokerageNoteEntity extends AbstractEntity {
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

  @OneToMany(() => OperationsEntity, (operation) => operation.brokerage_note)
  operation: OperationsEntity[];

  @OneToMany(() => TaxesEntity, (taxes) => taxes.brokerage_note)
  taxes: TaxesEntity[];
}
