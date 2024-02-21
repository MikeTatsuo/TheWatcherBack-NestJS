import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { OperationsService } from '@/models/operations/operations.service';
import { OperationsEntity } from '@/models/operations/entities/operations.entity';
import { OperationsDTO } from '@/models/operations/interfaces/operations.dto';
import { CreateOperationsDTO } from '@/models/operations/interfaces/create-operations.dto';

@ApiTags('Operations')
@Controller('operations')
export class OperationsController {
  private readonly operationsService: OperationsService;

  constructor(operationsService: OperationsService) {
    this.operationsService = operationsService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationsEntity>> {
    return this.operationsService.getAll(paginationOptions);
  }

  @Get('by_id/:operations_id')
  @ApiParam({ name: 'operations_id', required: true, type: 'number' })
  getById(@Param('operations_id') operations_id: number): Promise<OperationsEntity> {
    return this.operationsService.getById(operations_id);
  }

  @Get('by_operation_type/:operation_type_id')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'operation_type_id', required: true, type: 'number' })
  getByOperationType(
    @Param('operation_type_id') operation_type_id: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationsEntity>> {
    return this.operationsService.getByOperationType(operation_type_id, paginationOptions);
  }

  @Get('by_account/:account_id')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'account_id', required: true, type: 'number' })
  getByAccount(
    @Param('account_id') account_id: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationsEntity>> {
    return this.operationsService.getByAccount(account_id, paginationOptions);
  }

  @Get('by_ni_type/:ni_type_id')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'ni_type_id', required: true, type: 'number' })
  getByNIType(
    @Param('ni_type_id') ni_type_id: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationsEntity>> {
    return this.operationsService.getByNIType(ni_type_id, paginationOptions);
  }

  @Get('by_date/:date')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'date', required: true, type: 'Date' })
  getByDate(
    @Param('date') date: Date,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationsEntity>> {
    return this.operationsService.getByDate(date, paginationOptions);
  }

  @Post()
  @ApiBody({ required: true, type: CreateOperationsDTO })
  createOperation(@Body() operations: CreateOperationsDTO): Promise<OperationsEntity> {
    return this.operationsService.create(operations);
  }

  @Put(':operations_id')
  @ApiBody({ required: true, type: OperationsDTO })
  @ApiParam({ name: 'operations_id', required: true, type: 'number' })
  updateOperation(@Param('operations_id') operations_id: number, @Body() operation: OperationsDTO) {
    return this.operationsService.update(operations_id, operation);
  }

  @Patch(':operations_id')
  @ApiBody({ required: true, type: OperationsDTO })
  @ApiParam({ name: 'operations_id', required: true, type: 'number' })
  partialUpdateOperation(
    @Param('operations_id') operations_id: number,
    @Body() operation: Partial<OperationsDTO>,
  ) {
    return this.operationsService.update(operations_id, operation);
  }

  @Delete(':operations_id')
  @ApiParam({ name: 'operations_id', required: true, type: 'number' })
  deleteOperation(@Param('operations_id') operations_id: number): Promise<number> {
    return this.operationsService.delete(operations_id);
  }
}
