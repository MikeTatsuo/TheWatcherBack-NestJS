import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { AssetTypeService } from '@/models/asset_type/asset_type.service';
import { AssetTypeEntity } from '@/models/asset_type/entities/asset_type.entity';
import { AssetTypeDTO } from '@/models/asset_type/interfaces/asset_type.dto';

@ApiTags('Asset Type')
@Controller('asset_type')
export class AssetTypeController {
  private readonly assetTypeService: AssetTypeService;

  constructor(assetTypeService: AssetTypeService) {
    this.assetTypeService = assetTypeService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(
    @Query() paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<AssetTypeEntity>> {
    return this.assetTypeService.getAll(paginationOptions);
  }

  @Get('by_id/:asset_type_id')
  @ApiParam({ name: 'asset_type_id', required: true, type: 'number' })
  getById(@Param('asset_type_id') asset_type_id: number): Promise<AssetTypeEntity> {
    return this.assetTypeService.getById(asset_type_id);
  }

  @Post()
  @ApiBody({ required: true, type: AssetTypeDTO })
  createAssetType(@Body() AssetType: Partial<AssetTypeDTO>): Promise<AssetTypeEntity> {
    return this.assetTypeService.create(AssetType);
  }

  @Put(':asset_type_id')
  @ApiBody({ required: true, type: AssetTypeDTO })
  @ApiParam({ name: 'asset_type_id', required: true, type: 'number' })
  updateAssetType(
    @Param('asset_type_id') asset_type_id: number,
    @Body() AssetType: Partial<AssetTypeDTO>,
  ) {
    return this.assetTypeService.update(asset_type_id, AssetType);
  }

  @Patch(':asset_type_id')
  @ApiBody({ required: true, type: AssetTypeDTO })
  @ApiParam({ name: 'asset_type_id', required: true, type: 'number' })
  partialUpdateAssetType(
    @Param('asset_type_id') asset_type_id: number,
    @Body() AssetType: Partial<AssetTypeDTO>,
  ) {
    return this.assetTypeService.update(asset_type_id, AssetType);
  }

  @Delete(':asset_type_id')
  @ApiParam({ name: 'asset_type_id', required: true, type: 'number' })
  deleteAssetType(@Param('asset_type_id') asset_type_id: number): Promise<number> {
    return this.assetTypeService.delete(asset_type_id);
  }
}
