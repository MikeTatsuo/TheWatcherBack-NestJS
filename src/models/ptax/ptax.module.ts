import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ValuesModule } from '@/models/values/values.module';

import { PtaxEntity } from '@/models/ptax/entities/ptax.entity';
import { PtaxController } from '@/models/ptax/ptax.controller';
import { PtaxService } from '@/models/ptax/ptax.service';

@Module({
  imports: [TypeOrmModule.forFeature([PtaxEntity]), ValuesModule],
  controllers: [PtaxController],
  providers: [PtaxService],
  exports: [TypeOrmModule],
})
export class PtaxModule {}
