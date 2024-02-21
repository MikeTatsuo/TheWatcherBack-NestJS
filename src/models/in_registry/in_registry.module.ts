import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { INRegistryEntity } from '@/models/in_registry/entities/in_registry.entity';
import { INRegistryController } from '@/models/in_registry/in_registry.controller';
import { INRegistryService } from '@/models/in_registry/in_registry.service';

@Module({
  imports: [TypeOrmModule.forFeature([INRegistryEntity])],
  controllers: [INRegistryController],
  providers: [INRegistryService],
  exports: [TypeOrmModule],
})
export class INRegistryModule {}
