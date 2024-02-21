import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CountryEntity } from '@/models/country/entities/country.entity';
import { CountryController } from '@/models/country/country.controller';
import { CountryService } from '@/models/country/country.service';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity])],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [TypeOrmModule],
})
export class CountryModule {}
