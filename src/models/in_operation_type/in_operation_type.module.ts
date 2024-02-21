import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { INOperationTypeEntity } from '@/models/in_operation_type/entities/in_operation_type.entity';
import { INOperationTypeController } from '@/models/in_operation_type/in_operation_type.controller';
import { INOperationTypeService } from '@/models/in_operation_type/in_operation_type.service';

@Module({
  imports: [TypeOrmModule.forFeature([INOperationTypeEntity])],
  controllers: [INOperationTypeController],
  providers: [INOperationTypeService],
  exports: [TypeOrmModule],
})
export class INOperationTypeModule {}
