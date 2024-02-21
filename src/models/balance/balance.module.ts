import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ValuesModule } from '@/models/values/values.module';

import { BalanceEntity } from '@/models/balance/entities/balance.entity';
import { BalanceController } from '@/models/balance/balance.controller';
import { BalanceService } from '@/models/balance/balance.service';

@Module({
  imports: [TypeOrmModule.forFeature([BalanceEntity]), ValuesModule],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [TypeOrmModule, BalanceService],
})
export class BalanceModule {}
