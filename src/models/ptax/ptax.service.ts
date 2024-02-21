import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { ValuesService } from '@/models/values/values.service';

import { PtaxEntity } from '@/models/ptax/entities/ptax.entity';
import { PtaxDTO } from '@/models/ptax/interfaces/ptax.dto';

const relations = ['value', 'value.asset', 'value.asset.asset_type'];
const select = {
  id: true,
  date: true,
  value: { value: true, asset: { asset: true, ticker: true, asset_type: { asset_type: true } } },
};

@Injectable()
export class PtaxService {
  private readonly ptaxRepository: Repository<PtaxEntity>;
  private readonly valuesService: ValuesService;

  constructor(
    @InjectRepository(PtaxEntity)
    ptaxRepository: Repository<PtaxEntity>,
    valuesService: ValuesService,
  ) {
    this.ptaxRepository = ptaxRepository;
    this.valuesService = valuesService;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<PtaxEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.ptaxRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.ptaxRepository.createQueryBuilder('asset_type');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<PtaxEntity> {
    return this.ptaxRepository.findOneBy({ id });
  }

  async getByDate(
    date: Date,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<PtaxEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.ptaxRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
          where: { date },
          relations,
          select,
        })
        .then((entities) => {
          const queryBuilder = this.ptaxRepository.createQueryBuilder('asset_price');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async create({ date, value_buy, value_sell, asset_id }: Partial<PtaxDTO>): Promise<PtaxEntity> {
    return new Promise((resolve) => {
      const promises = [
        this.valuesService.create({ asset_id, value: value_buy }),
        this.valuesService.create({ asset_id, value: value_sell }),
      ];

      Promise.all(promises).then(([buyValue, sellValue]) => {
        resolve(
          this.ptaxRepository.save({
            date,
            value_buy_id: buyValue.id,
            value_sell_id: sellValue.id,
          }),
        );
      });
    });
  }

  async update(
    id: number,
    { date, asset_id, value_buy, value_sell }: Partial<PtaxDTO> | PtaxDTO,
  ): Promise<PtaxEntity> {
    return new Promise((resolve) => {
      this.ptaxRepository
        .findOneBy({ id })
        .then((ptax) => {
          const promises = [];
          if (asset_id || value_buy) {
            const value = {};
            if (value_buy) Object.assign(value, { ...value, value: value_buy });
            if (asset_id) Object.assign(value, { ...value, asset_id });
            this.valuesService.update(ptax.value_buy_id, value);
          }
          if (asset_id || value_sell) {
            const value = {};
            if (value_buy) Object.assign(value, { ...value, value: value_sell });
            if (asset_id) Object.assign(value, { ...value, asset_id });
            this.valuesService.update(ptax.value_sell_id, value);
          }

          return Promise.all(promises);
        })
        .then(() => {
          if (date) resolve(this.ptaxRepository.save({ id, date }));
          else resolve(this.ptaxRepository.findOneBy({ id }));
        });
    });
  }

  async delete(id: number): Promise<number> {
    return new Promise((resolve) => {
      this.ptaxRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
