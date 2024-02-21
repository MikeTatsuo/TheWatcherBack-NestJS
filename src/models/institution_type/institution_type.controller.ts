import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { InstitutionTypeService } from '@/models/institution_type/institution_type.service';
import { InstitutionTypeEntity } from '@/models/institution_type/entities/institution_type.entity';
import { InstitutionTypeDTO } from '@/models/institution_type/interfaces/institution_type.dto';

@ApiTags('Institution Type')
@Controller('institution_type')
export class InstitutionTypeController {
  private readonly institutionTypeService: InstitutionTypeService;

  constructor(institutionTypeService: InstitutionTypeService) {
    this.institutionTypeService = institutionTypeService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<InstitutionTypeEntity>> {
    return this.institutionTypeService.getAll(paginationOptions);
  }

  @Get('by_id/:institution_type_id')
  @ApiParam({ name: 'institution_type_id', required: true, type: 'number' })
  getById(
    @Param('institution_type_id') institution_type_id: number,
  ): Promise<InstitutionTypeEntity> {
    return this.institutionTypeService.getById(institution_type_id);
  }

  @Post()
  @ApiBody({ required: true, type: InstitutionTypeDTO })
  createInstitutionType(
    @Body() institution_type: Partial<InstitutionTypeDTO>,
  ): Promise<InstitutionTypeEntity> {
    return this.institutionTypeService.create(institution_type);
  }

  @Put(':institution_type_id')
  @ApiBody({ required: true, type: InstitutionTypeDTO })
  @ApiParam({ name: 'institution_type_id', required: true, type: 'number' })
  updateInstitutionType(
    @Param() institution_type_id: number,
    @Body() institution_type: Partial<InstitutionTypeDTO>,
  ) {
    return this.institutionTypeService.update(institution_type_id, institution_type);
  }

  @Patch(':institution_type_id')
  @ApiBody({ required: true, type: InstitutionTypeDTO })
  @ApiParam({ name: 'institution_type_id', required: true, type: 'number' })
  partialUpdateInstitutionType(
    @Param() institution_type_id: number,
    @Body() institution_type: Partial<InstitutionTypeDTO>,
  ) {
    return this.institutionTypeService.update(institution_type_id, institution_type);
  }

  @Delete(':institution_type_id')
  @ApiParam({ name: 'institution_type_id', required: true, type: 'number' })
  deleteInstitutionType(
    @Param('institution_type_id') institution_type_id: number,
  ): Promise<number> {
    return this.institutionTypeService.delete(institution_type_id);
  }
}
