import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { BrokerageNoteService } from './brokerage_note.service';
import { BrokerageNoteEntity } from './entities/brokerage_note.entity';
import { BrokerageNoteDTO } from './interfaces/brokerage_note.dto';

@ApiTags('Brokerage Note')
@Controller('brokerage_note')
export class BrokerageNoteController {
  private readonly brokerageNoteService: BrokerageNoteService;

  constructor(brokerageNoteService: BrokerageNoteService) {
    this.brokerageNoteService = brokerageNoteService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<BrokerageNoteEntity>> {
    return this.brokerageNoteService.getAll(paginationOptions);
  }

  @Get('by_id/:brokerage_note_id')
  @ApiParam({ name: 'brokerage_note_id', required: true, type: 'number' })
  getById(@Param('brokerage_note_id') brokerage_note_id: number): Promise<BrokerageNoteEntity> {
    return this.brokerageNoteService.getById(brokerage_note_id);
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
  ): Promise<PaginationDTO<BrokerageNoteEntity>> {
    return this.brokerageNoteService.getByAccount(account_id, paginationOptions);
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
  ): Promise<PaginationDTO<BrokerageNoteEntity>> {
    return this.brokerageNoteService.getByDate(date, paginationOptions);
  }

  @Post()
  @ApiBody({ required: true, type: BrokerageNoteDTO })
  createBrokerageNote(@Body() brokerageNote: BrokerageNoteDTO): Promise<BrokerageNoteEntity> {
    return this.brokerageNoteService.create(brokerageNote);
  }

  @Put(':brokerage_note_id')
  @ApiBody({ required: true, type: BrokerageNoteDTO })
  @ApiParam({ name: 'brokerage_note_id', required: true, type: 'number' })
  updateBrokerageNote(@Param() brokerage_note_id: number, @Body() brokerageNote: BrokerageNoteDTO) {
    return this.brokerageNoteService.update(brokerage_note_id, brokerageNote);
  }

  @Patch(':brokerage_note_id')
  @ApiBody({ required: true, type: BrokerageNoteDTO })
  @ApiParam({ name: 'brokerage_note_id', required: true, type: 'number' })
  partialUpdateBrokerageNote(
    @Param() brokerage_note_id: number,
    @Body() brokerageNote: Partial<BrokerageNoteDTO>,
  ) {
    return this.brokerageNoteService.update(brokerage_note_id, brokerageNote);
  }

  @Delete(':brokerage_note_id')
  @ApiQuery({
    name: 'brokerage_note_id',
    required: true,
    type: 'number',
    schema: { type: 'array', items: { type: 'number' } },
  })
  deleteBrokerageNote(
    @Query('brokerage_note_id') brokerage_note_id: number | number[],
  ): Promise<number | number[]> {
    return this.brokerageNoteService.delete(brokerage_note_id);
  }
}
