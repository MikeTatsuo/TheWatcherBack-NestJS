import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { ValuesDTO } from '@/models/values/interfaces/values.dto';

import { OperationAssetsService } from '@/models/operation_assets/operation_assets.service';
import { OperationAssetsEntity } from '@/models/operation_assets/entities/operation_assets.entity';
import { OperationAssetsDTO } from '@/models/operation_assets/interfaces/operation_assets.dto';

@ApiTags('Operation Assets')
@Controller('operation_assets')
export class OperationAssetsController {
  private readonly operationAssetsService: OperationAssetsService;

  constructor(operationAssetsService: OperationAssetsService) {
    this.operationAssetsService = operationAssetsService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationAssetsEntity>> {
    return this.operationAssetsService.getAll(paginationOptions);
  }

  @Get('by_id/:operation_asset_id')
  @ApiParam({ name: 'operation_asset_id', required: true, type: 'number' })
  getById(@Param('operation_asset_id') operation_asset_id: number): Promise<OperationAssetsEntity> {
    return this.operationAssetsService.getById(operation_asset_id);
  }

  @Get('by_operation/:operation_id')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'operation_id', required: true, type: 'number' })
  getByOperation(
    @Param('operation_id') operation_id: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationAssetsEntity>> {
    return this.operationAssetsService.getByOperation(operation_id, paginationOptions);
  }

  @Post()
  @ApiBody({ required: true, type: OperationAssetsDTO })
  createOperation(@Body() operation_asset: OperationAssetsDTO): Promise<OperationAssetsEntity> {
    return this.operationAssetsService.create(operation_asset);
  }

  @Post('/:operation_id/:positive')
  @ApiBody({ required: true, type: ValuesDTO })
  @ApiParam({ name: 'operation_id', required: true, type: 'number' })
  @ApiParam({ name: 'positive', required: true, type: 'boolean' })
  createOperationValue(
    @Param('operation_id') operation_id: number,
    @Param('positive') positive: boolean,
    @Body() valueToCreate: ValuesDTO,
  ): Promise<OperationAssetsEntity> {
    return this.operationAssetsService.createOperationValue(valueToCreate, operation_id, positive);
  }

  @Put(':operation_asset_id')
  @ApiBody({ required: true, type: OperationAssetsDTO })
  @ApiParam({ name: 'operation_asset_id', required: true, type: 'number' })
  updateOperation(
    @Param() operation_asset_id: number,
    @Body() operation_asset: OperationAssetsDTO,
  ) {
    return this.operationAssetsService.update(operation_asset_id, operation_asset);
  }

  @Patch(':operation_asset_id')
  @ApiBody({ required: true, type: OperationAssetsDTO })
  @ApiParam({ name: 'operation_asset_id', required: true, type: 'number' })
  partialUpdateOperation(
    @Param() operation_asset_id: number,
    @Body() operation_asset: Partial<OperationAssetsDTO>,
  ) {
    return this.operationAssetsService.update(operation_asset_id, operation_asset);
  }

  @Delete(':operation_asset_id')
  @ApiParam({ name: 'operation_asset_id', required: true, type: 'number' })
  deleteOperation(@Param('operation_asset_id') operation_asset_id: number): Promise<number> {
    return this.operationAssetsService.delete(operation_asset_id);
  }
}
