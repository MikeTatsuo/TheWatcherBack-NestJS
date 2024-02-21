import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NiTypeService } from '@/models/ni_type/ni_type.service';
import { NiTypeController } from '@/models/ni_type/ni_type.controller';
import { NiTypeEntity } from '@/models/ni_type/entities/ni_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NiTypeEntity])],
  controllers: [NiTypeController],
  providers: [NiTypeService],
  exports: [TypeOrmModule],
})
export class NiTypeModule {}
