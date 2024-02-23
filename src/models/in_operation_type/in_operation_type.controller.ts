import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { INOperationTypeService } from '@/models/in_operation_type/in_operation_type.service';
import { INOperationTypeEntity } from '@/models/in_operation_type/entities/in_operation_type.entity';
import { INOperationTypeDTO } from '@/models/in_operation_type/interfaces/in_operation_type.dto';

@ApiTags('IN Operation Type')
@Controller('in_operation_type')
export class INOperationTypeController {
  private readonly inOperationTypeService: INOperationTypeService;

  constructor(inOperationTypeService: INOperationTypeService) {
    this.inOperationTypeService = inOperationTypeService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<INOperationTypeEntity>> {
    return this.inOperationTypeService.getAll(paginationOptions);
  }

  @Get('by_id/:in_operation_type_id')
  @ApiParam({ name: 'in_operation_type_id', required: true, type: 'number' })
  getById(
    @Param('in_operation_type_id') in_operation_type_id: number,
  ): Promise<INOperationTypeEntity> {
    return this.inOperationTypeService.getById(in_operation_type_id);
  }

  @Get('by_code/:in_operation_type_code')
  @ApiParam({ name: 'in_operation_type_code', required: true, type: 'string' })
  getByCode(
    @Param('in_operation_type_code') in_operation_type_code: string,
  ): Promise<INOperationTypeEntity> {
    return this.inOperationTypeService.getByCode(in_operation_type_code);
  }

  @Post()
  @ApiBody({ required: true, type: INOperationTypeDTO })
  createINOperationType(
    @Body() in_operation_type: Partial<INOperationTypeDTO>,
  ): Promise<INOperationTypeEntity> {
    return this.inOperationTypeService.create(in_operation_type);
  }

  @Put(':in_operation_type_id')
  @ApiBody({ required: true, type: INOperationTypeDTO })
  @ApiParam({ name: 'in_operation_type_id', required: true, type: 'number' })
  updateINOperationType(
    @Param() in_operation_type_id: number,
    @Body() in_operation_type: Partial<INOperationTypeDTO>,
  ) {
    return this.inOperationTypeService.update(in_operation_type_id, in_operation_type);
  }

  @Patch(':in_operation_type_id')
  @ApiBody({ required: true, type: INOperationTypeDTO })
  @ApiParam({ name: 'in_operation_type_id', required: true, type: 'number' })
  partialUpdateINOperationType(
    @Param() in_operation_type_id: number,
    @Body() in_operation_type: Partial<INOperationTypeDTO>,
  ) {
    return this.inOperationTypeService.update(in_operation_type_id, in_operation_type);
  }

  @Delete(':in_operation_type_id')
  @ApiQuery({
    name: 'in_operation_type_id',
    required: true,
    type: 'number',
    schema: { type: 'array', items: { type: 'number' } },
  })
  deleteINOperationType(
    @Query('in_operation_type_id') in_operation_type_id: number | number[],
  ): Promise<number | number[]> {
    return this.inOperationTypeService.delete(in_operation_type_id);
  }
}
