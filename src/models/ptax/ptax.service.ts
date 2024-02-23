import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parse } from 'papaparse';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { ValuesService } from '@/models/values/values.service';

import { PtaxEntity } from '@/models/ptax/entities/ptax.entity';
import { PtaxDTO } from '@/models/ptax/interfaces/ptax.dto';
import { PapaparseHelper } from '@/common/helpers/papaparse.helper';
import { AssetsService } from '../assets/assets.service';

const relations = ['value_buy', 'value_buy.asset', 'value_sell', 'value_sell.asset'];
const select = {
  id: true,
  date: true,
  value_buy: {
    value: true,
    qtd: true,
    asset: { asset: true, ticker: true },
  },
  value_sell: {
    value: true,
    qtd: true,
    asset: { asset: true, ticker: true },
  },
};

@Injectable()
export class PtaxService {
  private readonly ptaxRepository: Repository<PtaxEntity>;
  private readonly assetsService: AssetsService;
  private readonly valuesService: ValuesService;

  constructor(
    @InjectRepository(PtaxEntity)
    ptaxRepository: Repository<PtaxEntity>,
    assetsService: AssetsService,
    valuesService: ValuesService,
  ) {
    this.ptaxRepository = ptaxRepository;
    this.assetsService = assetsService;
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
          relations,
          select,
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

  async create({ date, value_buy, value_sell, asset_id }: PtaxDTO): Promise<PtaxEntity> {
    return new Promise((resolve) => {
      this.valuesService
        .batchCreate([
          { asset_id, value: value_buy, qtd: 1 },
          { asset_id, value: value_sell, qtd: 1 },
        ])
        .then(([buyValue, sellValue]) => {
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

  async createFromCSV(fileData: string): Promise<PtaxEntity> {
    return new Promise((resolve) => {
      const { transform } = PapaparseHelper.ptax;

      const parsedCsv = parse(fileData, {
        header: false,
        skipEmptyLines: true,
        transform,
      });

      const reducedValue = parsedCsv.data.reduce((acc, item) => {
        const convertedToObject = {
          date: item.at(0),
          asset: item.at(3),
          value_buy: item.at(4),
          value_sell: item.at(5),
        };
        return [...acc, convertedToObject];
      }, []);

      const valueBuyList = [];
      const valueSellList = [];
      const assetTicker = reducedValue.at(0).asset;
      const qtd = 1;

      this.assetsService
        .getByTicker(assetTicker)
        .then(({ id: asset_id }) => {
          reducedValue.forEach(({ value_buy, value_sell }) => {
            valueBuyList.push({ asset_id, value: value_buy, qtd });
            valueSellList.push({ asset_id, value: value_sell, qtd });
          });

          const valuesPromises = [
            this.valuesService.batchCreate(valueBuyList),
            this.valuesService.batchCreate(valueSellList),
          ];

          return Promise.all(valuesPromises);
        })
        .then(([buyList, sellList]) => {
          const ptaxList = reducedValue.map(({ date }, index) => ({
            date,
            value_buy_id: buyList[index].id,
            value_sell_id: sellList[index].id,
          }));

          resolve(this.ptaxRepository.save(ptaxList));
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

  async delete(id: number | number[]): Promise<number | number[]> {
    return new Promise((resolve) => {
      this.ptaxRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
