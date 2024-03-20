import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { ValueHelper } from '@/common/helpers/value.helper';

import { ValuesService } from '@/models/values/values.service';
import { ValuesDTO } from '@/models/values/interfaces/values.dto';

import { OperationAssetsEntity } from '@/models/operation_assets/entities/operation_assets.entity';
import { OperationAssetsDTO } from '@/models/operation_assets/interfaces/operation_assets.dto';

const relations = ['operation', 'value', 'value.asset', 'value.asset.asset_type'];
const select = {
  id: true,
  operation: {
    date: true,
    description: true,
  },
  value: {
    value: true,
    asset: {
      asset: true,
      ticker: true,
      asset_type: {
        asset_type: true,
      },
    },
  },
};

@Injectable()
export class OperationAssetsService {
  private readonly operationAssetsRepository: Repository<OperationAssetsEntity>;
  private readonly valuesService: ValuesService;

  constructor(
    @InjectRepository(OperationAssetsEntity)
    OperationAssetsRepository: Repository<OperationAssetsEntity>,
    ValuesService: ValuesService,
  ) {
    this.operationAssetsRepository = OperationAssetsRepository;
    this.valuesService = ValuesService;
  }

  async getAll(
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationAssetsEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.operationAssetsRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
          relations,
          select,
        })
        .then((entities) => {
          const queryBuilder =
            this.operationAssetsRepository.createQueryBuilder('operation_assets');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<OperationAssetsEntity> {
    return this.operationAssetsRepository.findOne({ where: { id }, relations, select });
  }

  async getByOperation(
    operation_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationAssetsEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.operationAssetsRepository
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
            this.operationAssetsRepository.countBy({ operation_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async create(operationAssets: OperationAssetsDTO): Promise<OperationAssetsEntity> {
    return this.operationAssetsRepository.save(operationAssets);
  }

  async createOperationValue(
    valueToCreate: ValuesDTO,
    operation_id: number,
    positive: boolean,
  ): Promise<OperationAssetsEntity> {
    const value = ValueHelper.correctValue(valueToCreate.value, positive);
    const qtd = ValueHelper.correctQtd(valueToCreate.qtd, positive);

    return this.valuesService
      .create({ ...valueToCreate, value, qtd })
      .then(({ id }) => this.operationAssetsRepository.save({ operation_id, value_id: id }));
  }

  async update(
    id: number,
    operationAssets: Partial<OperationAssetsDTO> | OperationAssetsDTO,
  ): Promise<OperationAssetsEntity> {
    return this.operationAssetsRepository.save({ id, ...operationAssets });
  }

  async updateOperationValue(
    id: number,
    valueToUpdate: ValuesDTO,
    positive: boolean,
  ): Promise<OperationAssetsEntity> {
    return this.getById(id)
      .then((operationAssets) => {
        const valueData = {};

        if (valueToUpdate.value) {
          const value = ValueHelper.correctValue(valueToUpdate.value, positive);
          Object.assign(valueData, { value });
        }

        if (valueToUpdate.qtd) {
          const qtd = ValueHelper.correctQtd(valueToUpdate.qtd, positive);
          Object.assign(valueData, { qtd });
        }

        return this.valuesService.update(operationAssets.value_id, valueData);
      })
      .then(() => this.getById(id));
  }

  async delete(id: number | number[]): Promise<number | number[]> {
    return new Promise((resolve) => {
      this.operationAssetsRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
