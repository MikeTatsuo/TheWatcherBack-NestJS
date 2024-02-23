import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { InstitutionService } from '@/models/institution/institution.service';
import { InstitutionEntity } from '@/models/institution/entities/institution.entity';
import { InstitutionDTO } from '@/models/institution/interfaces/institution.dto';

@ApiTags('Institution')
@Controller('institution')
export class InstitutionController {
  private readonly institutionService: InstitutionService;

  constructor(institutionService: InstitutionService) {
    this.institutionService = institutionService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<InstitutionEntity>> {
    return this.institutionService.getAll(paginationOptions);
  }

  @Get('by_id/:institution_id')
  @ApiParam({ name: 'institution_id', required: true, type: 'number' })
  getById(@Param('institution_id') institution_id: number): Promise<InstitutionEntity> {
    return this.institutionService.getById(institution_id);
  }

  @Get('by_institution_type/:institution_type_id')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'institution_type_id', required: true, type: 'number' })
  getByInstitutionType(
    @Param('institution_type_id') institution_type_id: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<InstitutionEntity>> {
    return this.institutionService.getByInstitutionType(institution_type_id, paginationOptions);
  }

  @Get('by_country/:country_id')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'country_id', required: true, type: 'number' })
  getByCountry(
    @Param('country_id') country_id: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<InstitutionEntity>> {
    return this.institutionService.getByCountry(country_id, paginationOptions);
  }

  @Post()
  @ApiBody({ required: true, type: InstitutionDTO })
  createInstitution(@Body() institution: Partial<InstitutionDTO>): Promise<InstitutionEntity> {
    return this.institutionService.create(institution);
  }

  @Put(':institution_id')
  @ApiBody({ required: true, type: InstitutionDTO })
  @ApiParam({ name: 'institution_id', required: true, type: 'number' })
  updateInstitution(@Param() institution_id: number, @Body() institution: Partial<InstitutionDTO>) {
    return this.institutionService.update(institution_id, institution);
  }

  @Patch(':institution_id')
  @ApiBody({ required: true, type: InstitutionDTO })
  @ApiParam({ name: 'institution_id', required: true, type: 'number' })
  partialUpdateInstitution(
    @Param() institution_id: number,
    @Body() institution: Partial<InstitutionDTO>,
  ) {
    return this.institutionService.update(institution_id, institution);
  }

  @Delete(':institution_id')
  @ApiQuery({
    name: 'institution_id',
    required: true,
    type: 'number',
    schema: { type: 'array', items: { type: 'number' } },
  })
  deleteInstitution(
    @Query('institution_id') institution_id: number | number[],
  ): Promise<number | number[]> {
    return this.institutionService.delete(institution_id);
  }
}
