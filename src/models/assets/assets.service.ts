import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { AssetsEntity } from '@/models/assets/entities/assets.entity';
import { AssetsDTO } from '@/models/assets/interfaces/assets.dto';

const relations = ['asset_type'];
const select = {
  id: true,
  ticker: true,
  asset: true,
  asset_type: {
    asset_type: true,
  },
};

@Injectable()
export class AssetsService {
  private readonly assetsRepository: Repository<AssetsEntity>;

  constructor(
    @InjectRepository(AssetsEntity)
    assetsRepository: Repository<AssetsEntity>,
  ) {
    this.assetsRepository = assetsRepository;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<AssetsEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.assetsRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
          relations,
          select,
        })
        .then((entities) => {
          const queryBuilder = this.assetsRepository.createQueryBuilder('assets');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<AssetsEntity> {
    return this.assetsRepository.findOne({ where: { id }, relations, select });
  }

  async getByTicker(ticker: string): Promise<AssetsEntity> {
    return this.assetsRepository.findOne({ where: { ticker }, relations, select });
  }

  async getByAssetType(
    asset_type_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<AssetsEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.assetsRepository
        .find({
          where: { asset_type_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
          relations,
          select,
        })
        .then((entities) => {
          return Promise.all([
            this.assetsRepository.countBy({ asset_type_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async create(assets: Partial<AssetsDTO>): Promise<AssetsEntity> {
    return this.assetsRepository.save(assets);
  }

  async update(id: number, assets: Partial<AssetsDTO> | AssetsDTO): Promise<AssetsEntity> {
    return this.assetsRepository.save({ id, ...assets });
  }

  async delete(id: number | number[]): Promise<number | number[]> {
    return new Promise((resolve) => {
      this.assetsRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
