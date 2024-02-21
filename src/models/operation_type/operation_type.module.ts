import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OperationTypeEntity } from '@/models/operation_type/entities/operation_type.entity';
import { OperationTypeController } from '@/models/operation_type/operation_type.controller';
import { OperationTypeService } from '@/models/operation_type/operation_type.service';

@Module({
  imports: [TypeOrmModule.forFeature([OperationTypeEntity])],
  controllers: [OperationTypeController],
  providers: [OperationTypeService],
  exports: [TypeOrmModule],
})
export class OperationTypeModule {}
