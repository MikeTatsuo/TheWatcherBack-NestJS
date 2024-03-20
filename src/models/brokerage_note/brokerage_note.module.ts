import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from '../account/account.module';

import { BrokerageNoteController } from './brokerage_note.controller';
import { BrokerageNoteService } from './brokerage_note.service';
import { BrokerageNoteEntity } from './entities/brokerage_note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrokerageNoteEntity]), AccountModule],
  controllers: [BrokerageNoteController],
  providers: [BrokerageNoteService],
  exports: [TypeOrmModule, BrokerageNoteService],
})
export class BrokerageNoteModule {}
