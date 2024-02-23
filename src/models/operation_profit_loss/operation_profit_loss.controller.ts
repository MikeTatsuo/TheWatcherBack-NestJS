import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { OperationProfitLossService } from '@/models/operation_profit_loss/operation_profit_loss.service';
import { OperationProfitLossEntity } from '@/models/operation_profit_loss/entities/operation_profit_loss.entity';
import { OperationProfitLossDTO } from '@/models/operation_profit_loss/interfaces/operation_profit_loss.dto';

@ApiTags('Operation Profit Loss')
@Controller('operation_profit_loss')
export class OperationProfitLossController {
  private readonly operationProfitLossService: OperationProfitLossService;

  constructor(operationProfitLossService: OperationProfitLossService) {
    this.operationProfitLossService = operationProfitLossService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationProfitLossEntity>> {
    return this.operationProfitLossService.getAll(paginationOptions);
  }

  @Get('by_id/:operation_profit_loss_id')
  @ApiParam({ name: 'operation_profit_loss_id', required: true, type: 'number' })
  getById(
    @Param('operation_profit_loss_id') operation_profit_loss_id: number,
  ): Promise<OperationProfitLossEntity> {
    return this.operationProfitLossService.getById(operation_profit_loss_id);
  }

  @Get('by_operation/:operation_id')
  @ApiParam({ name: 'operation_id', required: true, type: 'number' })
  getByOperation(@Param('operation_id') operation_id: number): Promise<OperationProfitLossEntity> {
    return this.operationProfitLossService.getByOperation(operation_id);
  }

  @Post()
  @ApiBody({ required: true, type: OperationProfitLossDTO })
  createOperationProfitLoss(
    @Body() operation_profit_loss: OperationProfitLossDTO,
  ): Promise<OperationProfitLossEntity> {
    return this.operationProfitLossService.create(operation_profit_loss);
  }

  @Put(':operation_profit_loss_id')
  @ApiBody({ required: true, type: OperationProfitLossDTO })
  @ApiParam({ name: 'operation_profit_loss_id', required: true, type: 'number' })
  updateOperationProfitLoss(
    @Param() operation_profit_loss_id: number,
    @Body() operation_profit_loss: OperationProfitLossDTO,
  ) {
    return this.operationProfitLossService.update(operation_profit_loss_id, operation_profit_loss);
  }

  @Patch(':operation_profit_loss_id')
  @ApiBody({ required: true, type: OperationProfitLossDTO })
  @ApiParam({ name: 'operation_profit_loss_id', required: true, type: 'number' })
  partialUpdateOperationProfitLoss(
    @Param() operation_profit_loss_id: number,
    @Body() operation_profit_loss: Partial<OperationProfitLossDTO>,
  ) {
    return this.operationProfitLossService.update(operation_profit_loss_id, operation_profit_loss);
  }

  @Delete(':operation_profit_loss_id')
  @ApiQuery({
    name: 'operation_profit_loss_id',
    required: true,
    type: 'number',
    schema: { type: 'array', items: { type: 'number' } },
  })
  deleteOperationProfitLoss(
    @Query('operation_profit_loss_id') operation_profit_loss_id: number | number[],
  ): Promise<number | number[]> {
    return this.operationProfitLossService.delete(operation_profit_loss_id);
  }
}
