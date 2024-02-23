import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { TaxTypeService } from '@/models/tax_type/tax_type.service';
import { TaxTypeEntity } from '@/models/tax_type/entities/tax_type.entity';
import { TaxTypeDTO } from '@/models/tax_type/interfaces/tax_type.dto';

@ApiTags('Tax Type')
@Controller('tax_type')
export class TaxTypeController {
  private readonly taxTypeService: TaxTypeService;

  constructor(taxTypeService: TaxTypeService) {
    this.taxTypeService = taxTypeService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(@Query() paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<TaxTypeEntity>> {
    return this.taxTypeService.getAll(paginationOptions);
  }

  @Get('by_id/:tax_type_id')
  @ApiParam({ name: 'tax_type_id', required: true, type: 'number' })
  getById(@Param('tax_type_id') tax_type_id: number): Promise<TaxTypeEntity> {
    return this.taxTypeService.getById(tax_type_id);
  }

  @Post()
  @ApiBody({ required: true, type: TaxTypeDTO })
  createTaxType(@Body() taxType: Partial<TaxTypeDTO>): Promise<TaxTypeEntity> {
    return this.taxTypeService.create(taxType);
  }

  @Put(':tax_type_id')
  @ApiBody({ required: true, type: TaxTypeDTO })
  @ApiParam({ name: 'tax_type_id', required: true, type: 'number' })
  updateTaxType(@Param() tax_type_id: number, @Body() taxType: Partial<TaxTypeDTO>) {
    return this.taxTypeService.update(tax_type_id, taxType);
  }

  @Patch(':tax_type_id')
  @ApiBody({ required: true, type: TaxTypeDTO })
  @ApiParam({ name: 'tax_type_id', required: true, type: 'number' })
  partialUpdateTaxType(@Param() tax_type_id: number, @Body() taxType: Partial<TaxTypeDTO>) {
    return this.taxTypeService.update(tax_type_id, taxType);
  }

  @Delete(':tax_type_id')
  @ApiQuery({
    name: 'tax_type_id',
    required: true,
    type: 'number',
    schema: { type: 'array', items: { type: 'number' } },
  })
  deleteTaxType(@Query('tax_type_id') tax_type_id: number | number[]): Promise<number | number[]> {
    return this.taxTypeService.delete(tax_type_id);
  }
}
