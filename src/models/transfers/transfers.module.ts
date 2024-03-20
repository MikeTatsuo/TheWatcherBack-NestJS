import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransfersEntity } from './entities/transfers.entity';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { BalanceModule } from '../balance/balance.module';
import { OperationsModule } from '../operations/operations.module';
import { ValuesService } from '../values/values.service';
import { OperationAssetsService } from '../operation_assets/operation_assets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransfersEntity]),
    BalanceModule,
    OperationsModule,
    OperationAssetsService,
    ValuesService,
  ],
  controllers: [TransfersController],
  providers: [TransfersService],
  exports: [TypeOrmModule],
})
export class TransferModule {}
