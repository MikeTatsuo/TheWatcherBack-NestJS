import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { AssetsService } from '@/models/assets/assets.service';
import { AssetsEntity } from '@/models/assets/entities/assets.entity';
import { AssetsDTO } from '@/models/assets/interfaces/assets.dto';

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  private readonly assetsService: AssetsService;

  constructor(assetsService: AssetsService) {
    this.assetsService = assetsService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(@Query() paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<AssetsEntity>> {
    return this.assetsService.getAll(paginationOptions);
  }

  @Get('by_id/:assets_id')
  @ApiParam({ name: 'assets_id', required: true, type: 'number' })
  getById(@Param('assets_id') assets_id: number): Promise<AssetsEntity> {
    return this.assetsService.getById(assets_id);
  }

  @Get('by_ticker/:ticker')
  @ApiParam({ name: 'ticker', required: true, type: 'string' })
  getByTicker(@Param('ticker') ticker: string): Promise<AssetsEntity> {
    return this.assetsService.getByTicker(ticker.toUpperCase());
  }

  @Get('by_asset_type/:asset_type_id')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'asset_type_id', required: true, type: 'number' })
  getByAssetType(
    @Param('asset_type_id') asset_type_id: number,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<AssetsEntity>> {
    return this.assetsService.getByAssetType(asset_type_id, paginationOptions);
  }

  @Post()
  @ApiBody({ required: true, type: AssetsDTO })
  createAssets(@Body() Assets: Partial<AssetsDTO>): Promise<AssetsEntity> {
    return this.assetsService.create(Assets);
  }

  @Put(':assets_id')
  @ApiBody({ required: true, type: AssetsDTO })
  @ApiParam({ name: 'assets_id', required: true, type: 'number' })
  updateAssets(@Param('assets_id') assets_id: number, @Body() Assets: Partial<AssetsDTO>) {
    return this.assetsService.update(assets_id, Assets);
  }

  @Patch(':assets_id')
  @ApiBody({ required: true, type: AssetsDTO })
  @ApiParam({ name: 'assets_id', required: true, type: 'number' })
  partialUpdateAssets(@Param('assets_id') assets_id: number, @Body() Assets: Partial<AssetsDTO>) {
    return this.assetsService.update(assets_id, Assets);
  }

  @Delete(':assets_id')
  @ApiParam({ name: 'assets_id', required: true, type: 'number' })
  deleteAssets(@Param('assets_id') assets_id: number): Promise<number> {
    return this.assetsService.delete(assets_id);
  }
}
