import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { AccountService } from '@/models/account/account.service';
import { AccountEntity } from '@/models/account/entities/account.entity';
import { AccountDTO } from '@/models/account/interfaces/account.dto';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  private readonly accountService: AccountService;

  constructor(accountService: AccountService) {
    this.accountService = accountService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(@Query() paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<AccountEntity>> {
    return this.accountService.getAll(paginationOptions);
  }

  @Get('by_id/:account_id')
  @ApiParam({ name: 'account_id', required: true, type: 'number' })
  getById(@Param('account_id') account_id: number): Promise<AccountEntity> {
    return this.accountService.getById(account_id);
  }

  @Get('by_institution/:institution_id')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'institution_id', required: true, type: 'number' })
  getByInstitution(
    @Param('institution_id') institution_id: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<AccountEntity>> {
    return this.accountService.getByInstitution(institution_id, paginationOptions);
  }

  @Get('by_account_type/:account_type_id')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'account_type_id', required: true, type: 'number' })
  getByAccountType(
    @Param('account_type_id') account_type_id: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<AccountEntity>> {
    return this.accountService.getByAccountType(account_type_id, paginationOptions);
  }

  @Post()
  @ApiBody({ required: true, type: AccountDTO })
  createAccount(@Body() account: Partial<AccountDTO>): Promise<AccountEntity> {
    return this.accountService.create(account);
  }

  @Put(':account_id')
  @ApiBody({ required: true, type: AccountDTO })
  @ApiParam({ name: 'account_id', required: true, type: 'number' })
  updateAccount(@Param() account_id: number, @Body() account: Partial<AccountDTO>) {
    return this.accountService.update(account_id, account);
  }

  @Patch(':account_id')
  @ApiBody({ required: true, type: AccountDTO })
  @ApiParam({ name: 'account_id', required: true, type: 'number' })
  partialUpdateAccount(@Param() account_id: number, @Body() account: Partial<AccountDTO>) {
    return this.accountService.update(account_id, account);
  }

  @Delete(':account_id')
  @ApiParam({ name: 'account_id', required: true, type: 'number' })
  deleteAccount(@Param('account_id') account_id: number): Promise<number> {
    return this.accountService.delete(account_id);
  }
}
