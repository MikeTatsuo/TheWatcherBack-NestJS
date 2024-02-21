import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaxTypeEntity } from '@/models/tax_type/entities/tax_type.entity';
import { TaxTypeController } from '@/models/tax_type/tax_type.controller';
import { TaxTypeService } from '@/models/tax_type/tax_type.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaxTypeEntity])],
  controllers: [TaxTypeController],
  providers: [TaxTypeService],
  exports: [TypeOrmModule],
})
export class TaxTypeModule {}
