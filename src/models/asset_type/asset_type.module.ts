import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetTypeEntity } from '@/models/asset_type/entities/asset_type.entity';
import { AssetTypeController } from '@/models/asset_type/asset_type.controller';
import { AssetTypeService } from '@/models/asset_type/asset_type.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssetTypeEntity])],
  controllers: [AssetTypeController],
  providers: [AssetTypeService],
  exports: [TypeOrmModule],
})
export class AssetTypeModule {}
