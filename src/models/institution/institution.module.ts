import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InstitutionEntity } from '@/models/institution/entities/institution.entity';
import { InstitutionController } from '@/models/institution/institution.controller';
import { InstitutionService } from '@/models/institution/institution.service';

@Module({
  imports: [TypeOrmModule.forFeature([InstitutionEntity])],
  controllers: [InstitutionController],
  providers: [InstitutionService],
  exports: [TypeOrmModule],
})
export class InstitutionModule {}
