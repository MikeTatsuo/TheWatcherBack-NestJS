import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { readFileSync } from 'fs';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { PtaxService } from '@/models/ptax/ptax.service';
import { PtaxEntity } from '@/models/ptax/entities/ptax.entity';
import { PtaxDTO } from '@/models/ptax/interfaces/ptax.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  createPtax(@Body() Ptax: PtaxDTO): Promise<PtaxEntity> {
    return this.ptaxService.create(Ptax);
  }

  @Post('from_csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'csv',
        filename: (req, file, cb) => {
          cb(null, 'ptax.csv');
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createFromCSV() {
    const csvFile = readFileSync('csv/ptax.csv');
    const csvData = csvFile.toString();

    return this.ptaxService.createFromCSV(csvData);
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

  @Delete()
  @ApiQuery({
    name: 'ptax_id',
    required: true,
    type: 'number',
    schema: { type: 'array', items: { type: 'number' } },
  })
  deletePtax(@Query('ptax_id') ptax_id: number | number[]): Promise<number | number[]> {
    return this.ptaxService.delete(ptax_id);
  }
}
