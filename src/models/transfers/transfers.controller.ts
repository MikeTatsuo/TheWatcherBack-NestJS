import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { TransfersService } from '@/models/transfers/transfers.service';
import { TransfersEntity } from '@/models/transfers/entities/transfers.entity';
import { TransfersDTO } from './interfaces/transfers.dto';

@ApiTags('Transfers')
@Controller('transfers')
export class TransfersController {
  private readonly transfersService: TransfersService;

  constructor(transfersService: TransfersService) {
    this.transfersService = transfersService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<TransfersEntity>> {
    return this.transfersService.getAll(paginationOptions);
  }

  @Get('by_id/:transfer_id')
  @ApiParam({ name: 'transfer_id', required: true, type: 'number' })
  getById(@Param('transfer_id') transfer_id: number): Promise<TransfersEntity> {
    return this.transfersService.getById(transfer_id);
  }

  @Post()
  @ApiBody({ required: true, type: TransfersDTO })
  createTransfers(@Body() transfer: TransfersDTO): Promise<TransfersEntity> {
    return this.transfersService.create(transfer);
  }

  @Put(':transfer_id')
  @ApiBody({ required: true, type: TransfersEntity })
  @ApiParam({ name: 'transfer_id', required: true, type: 'number' })
  updateTransfers(@Param() transfer_id: number, @Body() transfer: Partial<TransfersEntity>) {
    return this.transfersService.update(transfer_id, transfer);
  }

  @Patch(':transfer_id')
  @ApiBody({ required: true, type: TransfersEntity })
  @ApiParam({ name: 'transfer_id', required: true, type: 'number' })
  partialUpdateTransfers(@Param() transfer_id: number, @Body() transfer: Partial<TransfersEntity>) {
    return this.transfersService.update(transfer_id, transfer);
  }

  @Delete(':transfer_id')
  @ApiQuery({
    name: 'transfer_id',
    required: true,
    type: 'number',
    schema: { type: 'array', items: { type: 'number' } },
  })
  deleteTransfers(
    @Query('transfer_id') transfer_id: number | number[],
  ): Promise<number | number[]> {
    return this.transfersService.delete(transfer_id);
  }
}
