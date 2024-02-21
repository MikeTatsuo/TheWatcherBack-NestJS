import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaxesEntity } from '@/models/taxes/entities/taxes.entity';
import { TaxesController } from '@/models/taxes/taxes.controller';
import { TaxesService } from '@/models/taxes/taxes.service';
import { ValuesModule } from '@/models/values/values.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaxesEntity]), ValuesModule],
  controllers: [TaxesController],
  providers: [TaxesService],
  exports: [TypeOrmModule],
})
export class TaxesModule {}
