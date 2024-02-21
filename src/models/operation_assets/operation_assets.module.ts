import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetsModule } from '@/models/assets/assets.module';
import { ValuesModule } from '@/models/values/values.module';

import { OperationAssetsEntity } from '@/models/operation_assets/entities/operation_assets.entity';
import { OperationAssetsController } from '@/models/operation_assets/operation_assets.controller';
import { OperationAssetsService } from '@/models/operation_assets/operation_assets.service';

@Module({
  imports: [TypeOrmModule.forFeature([OperationAssetsEntity]), AssetsModule, ValuesModule],
  controllers: [OperationAssetsController],
  providers: [OperationAssetsService],
  exports: [TypeOrmModule, OperationAssetsService],
})
export class OperationAssetsModule {}
