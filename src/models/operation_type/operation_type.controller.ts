import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { OperationTypeService } from '@/models/operation_type/operation_type.service';
import { OperationTypeEntity } from '@/models/operation_type/entities/operation_type.entity';
import { OperationTypeDTO } from '@/models/operation_type/interfaces/operation_type.dto';

@ApiTags('Operation Type')
@Controller('operation_type')
export class OperationTypeController {
  private readonly operationTypeService: OperationTypeService;

  constructor(operationTypeService: OperationTypeService) {
    this.operationTypeService = operationTypeService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationTypeEntity>> {
    return this.operationTypeService.getAll(paginationOptions);
  }

  @Get('by_id/:operation_type_id')
  @ApiParam({ name: 'operation_type_id', required: true, type: 'number' })
  getById(@Param('operation_type_id') operation_type_id: number): Promise<OperationTypeEntity> {
    return this.operationTypeService.getById(operation_type_id);
  }

  @Get('by_code/:operation_code')
  @ApiParam({ name: 'operation_code', required: true, type: 'string' })
  getByCode(@Param('operation_code') operation_code: string): Promise<OperationTypeEntity> {
    return this.operationTypeService.getByCode(operation_code);
  }

  @Get('by_in_code/:in_operation_type_id')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'in_operation_type_id', required: true, type: 'number' })
  getByINCode(
    @Param('in_operation_type_id') in_operation_type_id: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationTypeEntity>> {
    return this.operationTypeService.getByINOperationType(in_operation_type_id, paginationOptions);
  }

  @Get('by_in_registry/:in_registry_id')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'in_registry_id', required: true, type: 'number' })
  getByINRegistry(
    @Param('in_registry_id') in_registry_id: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationTypeEntity>> {
    return this.operationTypeService.getByINRegistryId(in_registry_id, paginationOptions);
  }

  @Post()
  @ApiBody({ required: true, type: OperationTypeDTO })
  createOperationType(@Body() operation_type: OperationTypeDTO): Promise<OperationTypeEntity> {
    return this.operationTypeService.create(operation_type);
  }

  @Put(':operation_type_id')
  @ApiBody({ required: true, type: OperationTypeDTO })
  @ApiParam({ name: 'operation_type_id', required: true, type: 'number' })
  updateOperationType(
    @Param() operation_type_id: number,
    @Body() operation_type: OperationTypeDTO,
  ) {
    return this.operationTypeService.update(operation_type_id, operation_type);
  }

  @Patch(':operation_type_id')
  @ApiBody({ required: true, type: OperationTypeDTO })
  @ApiParam({ name: 'operation_type_id', required: true, type: 'number' })
  partialUpdateOperationType(
    @Param() operation_type_id: number,
    @Body() operation_type: Partial<OperationTypeDTO>,
  ) {
    return this.operationTypeService.update(operation_type_id, operation_type);
  }

  @Delete(':operation_type_id')
  @ApiQuery({
    name: 'operation_type_id',
    required: true,
    type: 'number',
    schema: { type: 'array', items: { type: 'number' } },
  })
  deleteOperationType(
    @Query('operation_type_id') operation_type_id: number | number[],
  ): Promise<number | number[]> {
    return this.operationTypeService.delete(operation_type_id);
  }
}
