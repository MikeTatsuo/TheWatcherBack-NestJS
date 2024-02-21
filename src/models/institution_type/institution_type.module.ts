import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InstitutionTypeEntity } from '@/models/institution_type/entities/institution_type.entity';
import { InstitutionTypeController } from '@/models/institution_type/institution_type.controller';
import { InstitutionTypeService } from '@/models/institution_type/institution_type.service';

@Module({
  imports: [TypeOrmModule.forFeature([InstitutionTypeEntity])],
  controllers: [InstitutionTypeController],
  providers: [InstitutionTypeService],
  exports: [TypeOrmModule],
})
export class InstitutionTypeModule {}
