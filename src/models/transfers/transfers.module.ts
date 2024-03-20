import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransfersEntity } from './entities/transfers.entity';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { BalanceModule } from '../balance/balance.module';
import { OperationsModule } from '../operations/operations.module';
import { OperationAssetsModule } from '../operation_assets/operation_assets.module';
import { ValuesModule } from '../values/values.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransfersEntity]),
    BalanceModule,
    OperationsModule,
    OperationAssetsModule,
    ValuesModule,
  ],
  controllers: [TransfersController],
  providers: [TransfersService],
  exports: [TypeOrmModule],
})
export class TransferModule {}
