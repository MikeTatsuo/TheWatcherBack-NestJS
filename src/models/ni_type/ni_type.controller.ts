import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { NiTypeEntity } from '@/models/ni_type/entities/ni_type.entity';
import { NiTypeService } from '@/models/ni_type/ni_type.service';
import { NiTypeDTO } from '@/models/ni_type/interfaces/ni_type.dto';

@ApiTags('NI Type')
@Controller('ni_type')
export class NiTypeController {
  private readonly niTypeService: NiTypeService;

  constructor(niTypeService: NiTypeService) {
    this.niTypeService = niTypeService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(@Query() pagination_options: PaginationOptionsDTO): Promise<PaginationDTO<NiTypeEntity>> {
    return this.niTypeService.getAll(pagination_options);
  }

  @Get('by_id/:ni_type_id')
  @ApiParam({ name: 'ni_type_id', required: true, type: 'number' })
  getById(@Param('ni_type_id') ni_type_id: number): Promise<NiTypeEntity> {
    return this.niTypeService.getById(ni_type_id);
  }

  @Get('by_code/:ni_type_code')
  @ApiParam({ name: 'ni_type_code', required: true, type: 'number' })
  getByCode(@Param('ni_type_code') ni_type_code: number): Promise<NiTypeEntity> {
    return this.niTypeService.getByCode(ni_type_code);
  }

  @Post()
  @ApiBody({ required: true, type: NiTypeDTO })
  createNiType(@Body() ni_type: Partial<NiTypeDTO>): Promise<NiTypeEntity> {
    return this.niTypeService.create(ni_type);
  }

  @Put(':ni_type_id')
  @ApiBody({ required: true, type: NiTypeDTO })
  @ApiParam({ name: 'ni_type_id', required: true, type: 'number' })
  updateNiType(@Param('ni_type_id') ni_type_id: number, @Body() ni_type: Partial<NiTypeDTO>) {
    return this.niTypeService.update(ni_type_id, ni_type);
  }

  @Patch(':ni_type_id')
  @ApiBody({ required: true, type: NiTypeDTO })
  @ApiParam({ name: 'ni_type_id', required: true, type: 'number' })
  partialUpdateNiType(
    @Param('ni_type_id') ni_type_id: number,
    @Body() ni_type: Partial<NiTypeDTO>,
  ) {
    return this.niTypeService.update(ni_type_id, ni_type);
  }

  @Delete(':ni_type_id')
  @ApiQuery({
    name: 'ni_type_id',
    required: true,
    type: 'number',
    schema: { type: 'array', items: { type: 'number' } },
  })
  deleteNiType(@Query('ni_type_id') ni_type_id: number | number[]): Promise<number | number[]> {
    return this.niTypeService.delete(ni_type_id);
  }
}
