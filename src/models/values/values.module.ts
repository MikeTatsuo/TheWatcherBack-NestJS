import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ValuesEntity } from '@/models/values/entities/values.entity';
import { ValuesController } from '@/models/values/values.controller';
import { ValuesService } from '@/models/values/values.service';

@Module({
  imports: [TypeOrmModule.forFeature([ValuesEntity])],
  controllers: [ValuesController],
  providers: [ValuesService],
  exports: [TypeOrmModule, ValuesService],
})
export class ValuesModule {}
