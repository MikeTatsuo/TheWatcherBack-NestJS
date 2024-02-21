import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ValuesModule } from '@/models/values/values.module';

import { OperationProfitLossEntity } from '@/models/operation_profit_loss/entities/operation_profit_loss.entity';
import { OperationProfitLossController } from '@/models/operation_profit_loss/operation_profit_loss.controller';
import { OperationProfitLossService } from '@/models/operation_profit_loss/operation_profit_loss.service';

@Module({
  imports: [TypeOrmModule.forFeature([OperationProfitLossEntity]), ValuesModule],
  controllers: [OperationProfitLossController],
  providers: [OperationProfitLossService],
  exports: [TypeOrmModule],
})
export class OperationProfitLossModule {}
