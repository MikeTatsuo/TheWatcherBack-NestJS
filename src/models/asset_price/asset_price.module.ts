import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ValuesModule } from '@/models/values/values.module';

import { AssetPriceEntity } from '@/models/asset_price/entities/asset_price.entity';
import { AssetPriceController } from '@/models/asset_price/asset_price.controller';
import { AssetPriceService } from '@/models/asset_price/asset_price.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssetPriceEntity]), ValuesModule],
  controllers: [AssetPriceController],
  providers: [AssetPriceService],
  exports: [TypeOrmModule],
})
export class AssetPriceModule {}
