import { IsDate, IsInt, IsString, Min } from '@nestjs/class-validator';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from '@nestjs/class-transformer';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';
import { OperationTypeEntity } from '@/models/operation_type/entities/operation_type.entity';
import { AccountEntity } from '@/models/account/entities/account.entity';
import { NiTypeEntity } from '@/models/ni_type/entities/ni_type.entity';
import { BrokerageNoteEntity } from '@/models/brokerage_note/entities/brokerage_note.entity';

@Entity('operations')
export class OperationsEntity extends AbstractEntity {
  @ManyToOne(() => OperationTypeEntity, (operation_type) => operation_type.id)
  @JoinColumn([{ name: 'operation_type_id', referencedColumnName: 'id' }])
  operation_type: OperationTypeEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  operation_type_id: number;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: AccountEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  account_id: number;

  @ManyToOne(() => NiTypeEntity, (ni_type) => ni_type.id)
  @JoinColumn([{ name: 'ni_type_id', referencedColumnName: 'id' }])
  ni_type: NiTypeEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  ni_type_id: number;

  @Column()
  @IsString()
  description: string;

  @Column({ type: 'timestamptz' })
  @IsDate()
  date: Date;

  @ManyToOne(() => BrokerageNoteEntity, (brokerage_note) => brokerage_note.id)
  @JoinColumn([{ name: 'brokerage_note_id', referencedColumnName: 'id' }])
  brokerage_note: BrokerageNoteEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  brokerage_note_id: number;
}
