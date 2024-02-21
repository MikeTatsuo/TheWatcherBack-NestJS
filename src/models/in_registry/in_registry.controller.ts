import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { INRegistryService } from '@/models/in_registry/in_registry.service';
import { INRegistryEntity } from '@/models/in_registry/entities/in_registry.entity';
import { INRegistryDTO } from '@/models/in_registry/interfaces/in_registry.dto';

@ApiTags('IN Registry')
@Controller('in_registry')
export class INRegistryController {
  private readonly inRegistryService: INRegistryService;

  constructor(inRegistryService: INRegistryService) {
    this.inRegistryService = inRegistryService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<INRegistryEntity>> {
    return this.inRegistryService.getAll(paginationOptions);
  }

  @Get('by_id/:in_registry_id')
  @ApiParam({ name: 'in_registry_id', required: true, type: 'number' })
  getById(@Param('in_registry_id') in_registry_id: number): Promise<INRegistryEntity> {
    return this.inRegistryService.getById(in_registry_id);
  }

  @Get('by_code/:in_registry_code')
  @ApiParam({ name: 'in_registry_code', required: true, type: 'number' })
  getByCode(@Param('in_registry_code') in_registry_code: number): Promise<INRegistryEntity> {
    return this.inRegistryService.getByCode(in_registry_code);
  }

  @Get('by_hierarchy/:in_registry_hierarchy')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'in_registry_hierarchy', required: true, type: 'number' })
  getByHierarchy(
    @Param('in_registry_hierarchy') in_registry_hierarchy: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<INRegistryEntity>> {
    return this.inRegistryService.getByHierarchy(in_registry_hierarchy, paginationOptions);
  }

  @Post()
  @ApiBody({ required: true, type: INRegistryDTO })
  createINRegistry(@Body() inRegistry: Partial<INRegistryDTO>): Promise<INRegistryEntity> {
    return this.inRegistryService.create(inRegistry);
  }

  @Put(':in_registry_id')
  @ApiBody({ required: true, type: INRegistryDTO })
  @ApiParam({ name: 'in_registry_id', required: true, type: 'number' })
  updateINRegistry(@Param() in_registry_id: number, @Body() inRegistry: Partial<INRegistryDTO>) {
    return this.inRegistryService.update(in_registry_id, inRegistry);
  }

  @Patch(':in_registry_id')
  @ApiBody({ required: true, type: INRegistryDTO })
  @ApiParam({ name: 'in_registry_id', required: true, type: 'number' })
  partialUpdateINRegistry(
    @Param() in_registry_id: number,
    @Body() inRegistry: Partial<INRegistryDTO>,
  ) {
    return this.inRegistryService.update(in_registry_id, inRegistry);
  }

  @Delete(':in_registry_id')
  @ApiParam({ name: 'in_registry_id', required: true, type: 'number' })
  deleteINRegistry(@Param('in_registry_id') in_registry_id: number): Promise<number> {
    return this.inRegistryService.delete(in_registry_id);
  }
}
