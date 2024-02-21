import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetsEntity } from '@/models/assets/entities/assets.entity';
import { AssetsController } from '@/models/assets/assets.controller';
import { AssetsService } from '@/models/assets/assets.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssetsEntity])],
  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [TypeOrmModule, AssetsService],
})
export class AssetsModule {}
