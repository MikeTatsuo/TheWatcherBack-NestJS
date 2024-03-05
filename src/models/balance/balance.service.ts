import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { Order } from '@/common/enums/order.enum';
import { ValueHelper } from '@/common/helpers/value.helper';

import { ValuesService } from '@/models/values/values.service';

import { BalanceEntity } from '@/models/balance/entities/balance.entity';
import { BalanceDTO } from '@/models/balance/interfaces/balance.dto';
import { BalanceByAccountDTO } from '@/models/balance/interfaces/balance-by-account.dto';
import { UpdateBalanceDTO } from './interfaces/update-balance.dto';

const relations = ['account', 'value', 'value.asset', 'value.asset.asset_type'];
const select = {
  id: true,
  date: true,
  account: { name: true },
  value: { value: true, asset: { asset: true, ticker: true, asset_type: { asset_type: true } } },
};

@Injectable()
export class BalanceService {
  private readonly balanceRepository: Repository<BalanceEntity>;
  private readonly valuesService: ValuesService;

  constructor(
    @InjectRepository(BalanceEntity)
    BalanceRepository: Repository<BalanceEntity>,
    ValuesService: ValuesService,
  ) {
    this.balanceRepository = BalanceRepository;
    this.valuesService = ValuesService;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<BalanceEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.balanceRepository
        .find({
          take: per_page,
          skip,
          order: { date: 'DESC', [order_by]: order },
          relations,
          select,
        })
        .then((entities) => {
          const queryBuilder = this.balanceRepository.createQueryBuilder('operations');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<BalanceEntity> {
    return this.balanceRepository.findOne({ where: { id }, relations, select });
  }

  async getByAccount(
    account_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<BalanceByAccountDTO>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      const query = this.balanceRepository.createQueryBuilder('balance');

      query
        .select(['balance.id as id', 'ticker', 'asset', 'value', 'balance.date as date'])
        .leftJoin('balance.value', 'values', 'values.id = balance.value_id')
        .leftJoin('values.asset', 'assets', 'assets.id = values.asset_id')
        .where('account_id = :account_id', { account_id })
        .orderBy('values.asset_id')
        .distinctOn(['values.asset_id'])
        .addOrderBy('balance.date', Order.DESC)
        .addOrderBy(`balance.${order_by}`, order);

      const count = Object.create(query);

      query.offset(skip).limit(per_page);

      Promise.all([query.execute(), count.getRawMany()])
        .then(([entities, count]) => {
          const total = count.length;

          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getByAccountAndAsset(account_id: number, asset_id: number): Promise<BalanceByAccountDTO> {
    const query = this.balanceRepository.createQueryBuilder('balance');

    return query
      .select(['balance.id as id', 'ticker', 'asset', 'value', 'balance.date as date'])
      .leftJoin('balance.value', 'values', 'values.id = balance.value_id')
      .leftJoin('values.asset', 'assets', 'assets.id = values.asset_id')
      .where('account_id = :account_id', { account_id })
      .andWhere('assets.id = :id', { id: asset_id })
      .orderBy('values.asset_id')
      .distinctOn(['values.asset_id'])
      .addOrderBy('balance.date', Order.DESC)
      .getRawOne();
  }

  async getByAccountAssetAndDate(
    account_id: number,
    asset_id: number,
    date: Date,
  ): Promise<BalanceByAccountDTO> {
    const query = this.balanceRepository.createQueryBuilder('balance');

    return query
      .select(['balance.id as id', 'ticker', 'asset', 'value', 'balance.date as date'])
      .leftJoin('balance.value', 'values', 'values.id = balance.value_id')
      .leftJoin('values.asset', 'assets', 'assets.id = values.asset_id')
      .where('account_id = :account_id', { account_id })
      .andWhere('assets.id = :id', { id: asset_id })
      .andWhere('date > :date', { date })
      .orderBy('values.asset_id')
      .distinctOn(['values.asset_id'])
      .addOrderBy('balance.date', Order.DESC)
      .getRawOne();
  }

  async getByDate(
    date: Date,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<BalanceEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.balanceRepository
        .find({
          where: { date },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([this.balanceRepository.countBy({ date }), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getByOperation(
    operation_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<BalanceEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.balanceRepository
        .find({
          where: { operation_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
          relations,
          select,
        })
        .then((entities) => {
          return Promise.all([
            this.balanceRepository.countBy({ operation_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async create(balance: BalanceDTO): Promise<BalanceEntity> {
    return this.balanceRepository.save(balance);
  }

  async updateBalance({
    account_id,
    operation_id,
    date,
    value,
    qtd,
    asset_id,
    add,
  }: UpdateBalanceDTO): Promise<BalanceEntity> {
    const correctValue = ValueHelper.correctValue(value, add);
    const correctQtd = ValueHelper.correctValue(qtd, add);

    return this.getByAccountAndAsset(account_id, asset_id)
      .then((currentBalance) => {
        const value = parseFloat(currentBalance?.value ?? '0') + correctValue;
        const qtd = parseInt(currentBalance?.qtd ?? '0') + correctQtd;
        return this.valuesService.create({ asset_id, value, qtd });
      })
      .then((valueEntity) =>
        this.create({ account_id, value_id: valueEntity.id, date, operation_id }),
      );
  }

  async update(
    id: number,
    { account_id, operation_id, date, value, qtd, asset_id }: Partial<UpdateBalanceDTO>,
  ): Promise<BalanceEntity> {
    return this.getById(id)
      .then((currentBalance) => {
        const promises = [];
        if (value || qtd || asset_id) {
          const valueData = {};
          if (value) Object.assign(valueData, { value });
          if (qtd) Object.assign(valueData, { ...valueData, qtd });
          if (asset_id) Object.assign(valueData, { ...valueData, asset_id });

          promises.push(this.valuesService.update(currentBalance.value_id, valueData));
        }

        if (account_id || operation_id || date) {
          const balanceData = {};
          if (account_id) Object.assign(balanceData, { account_id });
          if (operation_id) Object.assign(balanceData, { ...balanceData, operation_id });
          if (date) Object.assign(balanceData, { ...balanceData, date });

          promises.push(this.balanceRepository.save({ id, ...balanceData }));
        }

        return Promise.all([Promise.resolve(id), ...promises]);
      })
      .then(([balanceId, ..._rest]) => this.getById(balanceId));
  }

  async delete(id: number | number[]): Promise<number | number[]> {
    return new Promise((resolve) => {
      this.balanceRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
