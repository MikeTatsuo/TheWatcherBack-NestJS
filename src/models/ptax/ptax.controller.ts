import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { PtaxService } from '@/models/ptax/ptax.service';
import { PtaxEntity } from '@/models/ptax/entities/ptax.entity';
import { PtaxDTO } from '@/models/ptax/interfaces/ptax.dto';

@ApiTags('PTAX')
@Controller('ptax')
export class PtaxController {
  private readonly ptaxService: PtaxService;

  constructor(ptaxService: PtaxService) {
    this.ptaxService = ptaxService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(@Query() paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<PtaxEntity>> {
    return this.ptaxService.getAll(paginationOptions);
  }

  @Get('by_id/:ptax_id')
  @ApiParam({ name: 'ptax_id', required: true, type: 'number' })
  getById(@Param('ptax_id') ptax_id: number): Promise<PtaxEntity> {
    return this.ptaxService.getById(ptax_id);
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
  ): Promise<PaginationDTO<PtaxEntity>> {
    return this.ptaxService.getByDate(date, paginationOptions);
  }

  @Post()
  @ApiBody({ required: true, type: PtaxDTO })
  createPtax(@Body() Ptax: Partial<PtaxDTO>): Promise<PtaxEntity> {
    return this.ptaxService.create(Ptax);
  }

  @Put(':ptax_id')
  @ApiBody({ required: true, type: PtaxDTO })
  @ApiParam({ name: 'ptax_id', required: true, type: 'number' })
  updatePtax(@Param('ptax_id') ptax_id: number, @Body() Ptax: Partial<PtaxDTO>) {
    return this.ptaxService.update(ptax_id, Ptax);
  }

  @Patch(':ptax_id')
  @ApiBody({ required: true, type: PtaxDTO })
  @ApiParam({ name: 'ptax_id', required: true, type: 'number' })
  partialUpdatePtax(@Param('ptax_id') ptax_id: number, @Body() Ptax: Partial<PtaxDTO>) {
    return this.ptaxService.update(ptax_id, Ptax);
  }

  @Delete(':ptax_id')
  @ApiParam({ name: 'ptax_id', required: true, type: 'number' })
  deletePtax(@Param('ptax_id') ptax_id: number): Promise<number> {
    return this.ptaxService.delete(ptax_id);
  }
}
