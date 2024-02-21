import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { AccountTypeService } from '@/models/account_type/account_type.service';
import { AccountTypeEntity } from '@/models/account_type/entities/account_type.entity';
import { AccountTypeDTO } from '@/models/account_type/interfaces/account_type.dto';

@ApiTags('Account Type')
@Controller('account_type')
export class AccountTypeController {
  private readonly accountTypeService: AccountTypeService;

  constructor(accountTypeService: AccountTypeService) {
    this.accountTypeService = accountTypeService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<AccountTypeEntity>> {
    return this.accountTypeService.getAll(paginationOptions);
  }

  @Get('by_id/:account_type_id')
  @ApiParam({ name: 'account_type_id', required: true, type: 'number' })
  getById(@Param('account_type_id') account_type_id: number): Promise<AccountTypeEntity> {
    return this.accountTypeService.getById(account_type_id);
  }

  @Post()
  @ApiBody({ required: true, type: AccountTypeDTO })
  createAccountType(@Body() AccountType: Partial<AccountTypeDTO>): Promise<AccountTypeEntity> {
    return this.accountTypeService.create(AccountType);
  }

  @Put(':account_type_id')
  @ApiBody({ required: true, type: AccountTypeDTO })
  @ApiParam({ name: 'account_type_id', required: true, type: 'number' })
  updateAccountType(
    @Param('account_type_id') account_type_id: number,
    @Body() AccountType: Partial<AccountTypeDTO>,
  ) {
    return this.accountTypeService.update(account_type_id, AccountType);
  }

  @Patch(':account_type_id')
  @ApiBody({ required: true, type: AccountTypeDTO })
  @ApiParam({ name: 'account_type_id', required: true, type: 'number' })
  partialUpdateAccountType(
    @Param('account_type_id') account_type_id: number,
    @Body() AccountType: Partial<AccountTypeDTO>,
  ) {
    return this.accountTypeService.update(account_type_id, AccountType);
  }

  @Delete(':account_type_id')
  @ApiParam({ name: 'account_type_id', required: true, type: 'number' })
  deleteAccountType(@Param('account_type_id') account_type_id: number): Promise<number> {
    return this.accountTypeService.delete(account_type_id);
  }
}
