import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OperationAssetsModule } from '@/models/operation_assets/operation_assets.module';
import { BalanceModule } from '@/models/balance/balance.module';

import { OperationsEntity } from '@/models/operations/entities/operations.entity';
import { OperationsController } from '@/models/operations/operations.controller';
import { OperationsService } from '@/models/operations/operations.service';

@Module({
  imports: [TypeOrmModule.forFeature([OperationsEntity]), BalanceModule, OperationAssetsModule],
  controllers: [OperationsController],
  providers: [OperationsService],
  exports: [TypeOrmModule, OperationsService],
})
export class OperationsModule {}
