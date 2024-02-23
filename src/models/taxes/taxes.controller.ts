import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { TaxesService } from '@/models/taxes/taxes.service';
import { TaxesEntity } from '@/models/taxes/entities/taxes.entity';
import { TaxesDTO } from '@/models/taxes/interfaces/taxes.dto';

@ApiTags('Taxes')
@Controller('taxes')
export class TaxesController {
  private readonly taxesService: TaxesService;

  constructor(taxesService: TaxesService) {
    this.taxesService = taxesService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(@Query() paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<TaxesEntity>> {
    return this.taxesService.getAll(paginationOptions);
  }

  @Get('by_id/:tax_id')
  @ApiParam({ name: 'tax_id', required: true, type: 'number' })
  getById(@Param('tax_id') tax_id: number): Promise<TaxesEntity> {
    return this.taxesService.getById(tax_id);
  }

  @Get('by_tax_type/:tax_type_id')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'tax_type_id', required: true, type: 'number' })
  getByTaxType(
    @Param('tax_type_id') tax_type_id: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<TaxesEntity>> {
    return this.taxesService.getByTaxType(tax_type_id, paginationOptions);
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
  ): Promise<PaginationDTO<TaxesEntity>> {
    return this.taxesService.getByOperation(operation_id, paginationOptions);
  }

  @Post()
  @ApiBody({ required: true, type: TaxesDTO })
  createTaxes(@Body() tax: TaxesDTO): Promise<TaxesEntity> {
    return this.taxesService.create(tax);
  }

  @Put(':tax_id')
  @ApiBody({ required: true, type: TaxesDTO })
  @ApiParam({ name: 'tax_id', required: true, type: 'number' })
  updateTaxes(@Param() tax_id: number, @Body() tax: Partial<TaxesDTO>) {
    return this.taxesService.update(tax_id, tax);
  }

  @Patch(':tax_id')
  @ApiBody({ required: true, type: TaxesDTO })
  @ApiParam({ name: 'tax_id', required: true, type: 'number' })
  partialUpdateTaxes(@Param() tax_id: number, @Body() tax: Partial<TaxesDTO>) {
    return this.taxesService.update(tax_id, tax);
  }

  @Delete(':tax_id')
  @ApiQuery({
    name: 'tax_id',
    required: true,
    type: 'number',
    schema: { type: 'array', items: { type: 'number' } },
  })
  deleteTaxes(@Query('tax_id') tax_id: number | number[]): Promise<number | number[]> {
    return this.taxesService.delete(tax_id);
  }
}
