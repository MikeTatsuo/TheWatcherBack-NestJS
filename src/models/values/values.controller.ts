import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { ValuesService } from '@/models/values/values.service';
import { ValuesEntity } from '@/models/values/entities/values.entity';
import { ValuesDTO } from '@/models/values/interfaces/values.dto';

@ApiTags('Values')
@Controller('values')
export class ValuesController {
  private readonly valuesService: ValuesService;

  constructor(valuesService: ValuesService) {
    this.valuesService = valuesService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(@Query() paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<ValuesEntity>> {
    return this.valuesService.getAll(paginationOptions);
  }

  @Get('by_id/:value_id')
  @ApiParam({ name: 'value_id', required: true, type: 'number' })
  getById(@Param('value_id') value_id: number): Promise<ValuesEntity> {
    return this.valuesService.getById(value_id);
  }

  @Get('by_asset/:asset_id')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'asset_id', required: true, type: 'number' })
  getByAsset(
    @Param('asset_id') asset_id: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<ValuesEntity>> {
    return this.valuesService.getByAsset(asset_id, paginationOptions);
  }

  @Post()
  @ApiBody({ required: true, type: ValuesDTO })
  createValue(@Body() value: Partial<ValuesDTO>): Promise<ValuesEntity> {
    return this.valuesService.create(value);
  }

  @Put(':value_id')
  @ApiBody({ required: true, type: ValuesDTO })
  @ApiParam({ name: 'value_id', required: true, type: 'number' })
  updateValue(@Param() value_id: number, @Body() value: Partial<ValuesDTO>) {
    return this.valuesService.update(value_id, value);
  }

  @Patch(':value_id')
  @ApiBody({ required: true, type: ValuesDTO })
  @ApiParam({ name: 'value_id', required: true, type: 'number' })
  partialUpdateValue(@Param() value_id: number, @Body() value: Partial<ValuesDTO>) {
    return this.valuesService.update(value_id, value);
  }

  @Delete(':value_id')
  @ApiParam({ name: 'value_id', required: true, type: 'number' })
  deleteValue(@Param('value_id') value_id: number): Promise<number> {
    return this.valuesService.delete(value_id);
  }
}
