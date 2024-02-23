import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { BalanceService } from '@/models/balance/balance.service';
import { BalanceEntity } from '@/models/balance/entities/balance.entity';
import { BalanceDTO } from '@/models/balance/interfaces/balance.dto';
import { BalanceByAccountDTO } from '@/models/balance/interfaces/balance-by-account.dto';
import { UpdateBalanceDTO } from '@/models/balance/interfaces/update-balance.dto';

@ApiTags('Balance')
@Controller('balance')
export class BalanceController {
  private readonly balanceService: BalanceService;

  constructor(balanceService: BalanceService) {
    this.balanceService = balanceService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(@Query() paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<BalanceEntity>> {
    return this.balanceService.getAll(paginationOptions);
  }

  @Get('by_id/:balance_id')
  @ApiParam({ name: 'balance_id', required: true, type: 'number' })
  getById(@Param('balance_id') balance_id: number): Promise<BalanceEntity> {
    return this.balanceService.getById(balance_id);
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
  ): Promise<PaginationDTO<BalanceByAccountDTO>> {
    return this.balanceService.getByAccount(account_id, paginationOptions);
  }

  @Get('by_account_and_asset/:account_id/:asset_id')
  @ApiParam({ name: 'account_id', required: true, type: 'number' })
  @ApiParam({ name: 'asset_id', required: true, type: 'number' })
  getBgetByAccountAndTickeryAccount(
    @Param('account_id') account_id: number,
    @Param('asset_id') asset_id: number,
  ): Promise<BalanceByAccountDTO> {
    return this.balanceService.getByAccountAndAsset(account_id, asset_id);
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
  ): Promise<PaginationDTO<BalanceEntity>> {
    return this.balanceService.getByDate(date, paginationOptions);
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
  ): Promise<PaginationDTO<BalanceEntity>> {
    return this.balanceService.getByOperation(operation_id, paginationOptions);
  }

  @Post()
  @ApiBody({ required: true, type: BalanceDTO })
  createBalance(@Body() balance: BalanceDTO): Promise<BalanceEntity> {
    return this.balanceService.create(balance);
  }

  @Post('/update_by_account')
  @ApiBody({ required: true, type: UpdateBalanceDTO })
  updateAccountBalance(
    @Body() { account_id, add, date, operation_id, asset_id, value, qtd }: UpdateBalanceDTO,
  ): Promise<BalanceEntity> {
    return this.balanceService.updateBalance(
      account_id,
      operation_id,
      date,
      value,
      qtd,
      asset_id,
      add,
    );
  }

  @Put(':balance_id')
  @ApiBody({ required: true, type: BalanceDTO })
  @ApiParam({ name: 'balance_id', required: true, type: 'number' })
  updateBalance(@Param() balance_id: number, @Body() balance: BalanceDTO) {
    return this.balanceService.update(balance_id, balance);
  }

  @Patch(':balance_id')
  @ApiBody({ required: true, type: BalanceDTO })
  @ApiParam({ name: 'balance_id', required: true, type: 'number' })
  partialUpdateBalance(@Param() balance_id: number, @Body() balance: Partial<BalanceDTO>) {
    return this.balanceService.update(balance_id, balance);
  }

  @Delete(':balance_id')
  @ApiParam({ name: 'balance_id', required: true, type: 'number' })
  deleteBalance(@Param('balance_id') balance_id: number): Promise<number> {
    return this.balanceService.delete(balance_id);
  }
}
