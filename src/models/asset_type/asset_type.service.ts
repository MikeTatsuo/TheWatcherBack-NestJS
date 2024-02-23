import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { AssetTypeEntity } from '@/models/asset_type/entities/asset_type.entity';
import { AssetTypeDTO } from '@/models/asset_type/interfaces/asset_type.dto';

@Injectable()
export class AssetTypeService {
  private readonly assetTypeRepository: Repository<AssetTypeEntity>;

  constructor(
    @InjectRepository(AssetTypeEntity)
    assetTypeRepository: Repository<AssetTypeEntity>,
  ) {
    this.assetTypeRepository = assetTypeRepository;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<AssetTypeEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.assetTypeRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.assetTypeRepository.createQueryBuilder('asset_type');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<AssetTypeEntity> {
    return this.assetTypeRepository.findOneBy({ id });
  }

  async create(assetType: Partial<AssetTypeDTO>): Promise<AssetTypeEntity> {
    return this.assetTypeRepository.save(assetType);
  }

  async update(
    id: number,
    assetType: Partial<AssetTypeDTO> | AssetTypeDTO,
  ): Promise<AssetTypeEntity> {
    return this.assetTypeRepository.save({ id, ...assetType });
  }

  async delete(id: number | number[]): Promise<number | number[]> {
    return new Promise((resolve) => {
      this.assetTypeRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
