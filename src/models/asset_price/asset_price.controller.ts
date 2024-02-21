import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { AssetPriceService } from '@/models/asset_price/asset_price.service';
import { AssetPriceEntity } from '@/models/asset_price/entities/asset_price.entity';
import { AssetPriceDTO } from '@/models/asset_price/interfaces/asset_price.dto';

@ApiTags('Asset Price')
@Controller('asset_price')
export class AssetPriceController {
  private readonly assetPriceService: AssetPriceService;

  constructor(assetPriceService: AssetPriceService) {
    this.assetPriceService = assetPriceService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<AssetPriceEntity>> {
    return this.assetPriceService.getAll(paginationOptions);
  }

  @Get('by_id/:asset_price_id')
  @ApiParam({ name: 'asset_price_id', required: true, type: 'number' })
  getById(@Param('asset_price_id') asset_price_id: number): Promise<AssetPriceEntity> {
    return this.assetPriceService.getById(asset_price_id);
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
  ): Promise<PaginationDTO<AssetPriceEntity>> {
    return this.assetPriceService.getByDate(date, paginationOptions);
  }

  @Get('by_asset/:ticker')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  @ApiParam({ name: 'ticker', required: true, type: 'string' })
  getByAsset(
    @Param('ticker') ticker: string,
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<AssetPriceEntity>> {
    return this.assetPriceService.getByAsset(ticker, paginationOptions);
  }

  @Get('by_asset_and_date/:ticker/:date')
  @ApiParam({ name: 'ticker', required: true, type: 'string' })
  @ApiParam({ name: 'date', required: true, type: 'Date' })
  getByAssetAndDate(
    @Param('ticker') ticker: string,
    @Param('date') date: Date,
  ): Promise<AssetPriceEntity> {
    return this.assetPriceService.getByAssetAndDate(ticker, date);
  }

  @Post()
  @ApiBody({ required: true, type: AssetPriceDTO })
  createAssetPrice(@Body() AssetPrice: AssetPriceDTO): Promise<AssetPriceEntity> {
    return this.assetPriceService.create(AssetPrice);
  }

  @Put(':asset_price_id')
  @ApiBody({ required: true, type: AssetPriceDTO })
  @ApiParam({ name: 'asset_price_id', required: true, type: 'number' })
  updateAssetPrice(
    @Param('asset_price_id') asset_price_id: number,
    @Body() AssetPrice: AssetPriceDTO,
  ) {
    return this.assetPriceService.update(asset_price_id, AssetPrice);
  }

  @Patch(':asset_price_id')
  @ApiBody({ required: true, type: AssetPriceDTO })
  @ApiParam({ name: 'asset_price_id', required: true, type: 'number' })
  partialUpdateAssetPrice(
    @Param('asset_price_id') asset_price_id: number,
    @Body() AssetPrice: Partial<AssetPriceDTO>,
  ) {
    return this.assetPriceService.update(asset_price_id, AssetPrice);
  }

  @Delete(':asset_price_id')
  @ApiParam({ name: 'asset_price_id', required: true, type: 'number' })
  deleteAssetPrice(@Param('asset_price_id') asset_price_id: number): Promise<number> {
    return this.assetPriceService.delete(asset_price_id);
  }
}
