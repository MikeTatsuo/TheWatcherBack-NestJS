import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { CountryService } from '@/models/country/country.service';
import { CountryEntity } from '@/models/country/entities/country.entity';
import { CountryDTO } from '@/models/country/interfaces/country.dto';

@ApiTags('Country')
@Controller('country')
export class CountryController {
  private readonly countryService: CountryService;

  constructor(countryService: CountryService) {
    this.countryService = countryService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(@Query() paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<CountryEntity>> {
    return this.countryService.getAll(paginationOptions);
  }

  @Get('by_id/:country_id')
  @ApiParam({ name: 'country_id', required: true, type: 'number' })
  getById(@Param('country_id') country_id: number): Promise<CountryEntity> {
    return this.countryService.getById(country_id);
  }

  @Get('by_code/:country_code')
  @ApiParam({ name: 'country_code', required: true, type: 'string' })
  getByCode(@Param('country_code') country_code: string): Promise<CountryEntity> {
    return this.countryService.getByCode(country_code);
  }

  @Get('by_name/:country_name')
  @ApiParam({ name: 'country_name', required: true, type: 'string' })
  getByName(@Param('country_name') country_name: string): Promise<CountryEntity> {
    return this.countryService.getByName(country_name);
  }

  @Post()
  @ApiBody({ required: true, type: CountryDTO })
  createCountry(@Body() country: Partial<CountryDTO>): Promise<CountryEntity> {
    return this.countryService.create(country);
  }

  @Put(':country_id')
  @ApiBody({ required: true, type: CountryDTO })
  @ApiParam({ name: 'country_id', required: true, type: 'number' })
  updateCountry(@Param('country_id') country_id: number, @Body() country: Partial<CountryDTO>) {
    return this.countryService.update(country_id, country);
  }

  @Patch(':country_id')
  @ApiBody({ required: true, type: CountryDTO })
  @ApiParam({ name: 'country_id', required: true, type: 'number' })
  partialUpdateCountry(
    @Param('country_id') country_id: number,
    @Body() country: Partial<CountryDTO>,
  ) {
    return this.countryService.update(country_id, country);
  }

  @Delete(':country_id')
  @ApiParam({ name: 'country_id', required: true, type: 'number' })
  deleteCountry(@Param('country_id') country_id: number): Promise<number> {
    return this.countryService.delete(country_id);
  }
}
