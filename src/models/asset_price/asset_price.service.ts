import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { ValuesService } from '@/models/values/values.service';

import { AssetPriceEntity } from '@/models/asset_price/entities/asset_price.entity';
import { AssetPriceDTO } from '@/models/asset_price/interfaces/asset_price.dto';

const relations = ['value', 'value.asset', 'value.asset.asset_type'];
const select = {
  id: true,
  date: true,
  value: { value: true, asset: { asset: true, ticker: true, asset_type: { asset_type: true } } },
};

@Injectable()
export class AssetPriceService {
  private readonly assetPriceRepository: Repository<AssetPriceEntity>;
  private readonly valueService: ValuesService;

  constructor(
    @InjectRepository(AssetPriceEntity)
    assetPriceRepository: Repository<AssetPriceEntity>,
    valueService: ValuesService,
  ) {
    this.assetPriceRepository = assetPriceRepository;
    this.valueService = valueService;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<AssetPriceEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.assetPriceRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.assetPriceRepository.createQueryBuilder('asset_type');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<AssetPriceEntity> {
    return this.assetPriceRepository.findOneBy({ id });
  }

  async getByDate(
    date: Date,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<AssetPriceEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.assetPriceRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
          where: { date },
          relations,
          select,
        })
        .then((entities) => {
          const queryBuilder = this.assetPriceRepository.createQueryBuilder('asset_price');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getByAsset(
    ticker: string,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<AssetPriceEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.assetPriceRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
          where: { value: { asset: { ticker } } },
          relations,
          select,
        })
        .then((entities) => {
          const queryBuilder = this.assetPriceRepository.createQueryBuilder('asset_price');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getByAssetAndDate(ticker: string, date: Date): Promise<AssetPriceEntity> {
    return this.assetPriceRepository.findOneBy({ value: { asset: { ticker } }, date });
  }

  async create({ asset_id, date, value, qtd }: AssetPriceDTO): Promise<AssetPriceEntity> {
    return this.valueService
      .create({ asset_id, value, qtd })
      .then(({ id }) => this.assetPriceRepository.save({ value_id: id, date }));
  }

  async update(
    id: number,
    { date, ...value }: Partial<AssetPriceDTO> | AssetPriceDTO,
  ): Promise<AssetPriceEntity> {
    return this.assetPriceRepository
      .findOneBy({ id })
      .then(({ value_id }) => {
        const promises = [];

        if (value) promises.push(this.valueService.update(value_id, value));
        if (date) promises.push(this.assetPriceRepository.save({ id, date }));

        return Promise.all(promises);
      })
      .then(() => this.assetPriceRepository.findOneBy({ id }));
  }

  async delete(id: number): Promise<number> {
    return new Promise((resolve) => {
      this.assetPriceRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
