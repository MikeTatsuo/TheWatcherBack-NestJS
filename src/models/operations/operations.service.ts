import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { BalanceService } from '@/models/balance/balance.service';
import { OperationAssetsService } from '@/models/operation_assets/operation_assets.service';

import { OperationsEntity } from '@/models/operations/entities/operations.entity';
import { OperationsDTO } from '@/models/operations/interfaces/operations.dto';
import { CreateOperationsDTO } from '@/models/operations/interfaces/create-operations.dto';

@Injectable()
export class OperationsService {
  private readonly operationsRepository: Repository<OperationsEntity>;
  private readonly balanceService: BalanceService;
  private readonly operationAssetsService: OperationAssetsService;

  constructor(
    @InjectRepository(OperationsEntity)
    OperationsRepository: Repository<OperationsEntity>,
    BalanceService: BalanceService,
    OperationAssetsService: OperationAssetsService,
  ) {
    this.operationsRepository = OperationsRepository;
    this.balanceService = BalanceService;
    this.operationAssetsService = OperationAssetsService;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<OperationsEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.operationsRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.operationsRepository.createQueryBuilder('operations');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<OperationsEntity> {
    return this.operationsRepository.findOneBy({ id });
  }

  async getByOperationType(
    operation_type_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationsEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.operationsRepository
        .find({
          where: { operation_type_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.operationsRepository.countBy({ operation_type_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getByAccount(
    account_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationsEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.operationsRepository
        .find({
          where: { account_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.operationsRepository.countBy({ account_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getByNIType(
    ni_type_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationsEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.operationsRepository
        .find({
          where: { ni_type_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.operationsRepository.countBy({ ni_type_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getByDate(
    date: Date,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationsEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.operationsRepository
        .find({
          where: { date },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.operationsRepository.countBy({ date }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async create(operation: CreateOperationsDTO): Promise<OperationsEntity> {
    return new Promise((resolve, reject) => {
      const { value_in, value_out, ...createOperation } = operation;

      this.operationsRepository
        .save(createOperation)
        .then((createdOp) => {
          if (value_in) {
            this.operationAssetsService.createOperationValue(value_in, createdOp.id, true);
            this.balanceService.updateBalance(
              operation.account_id,
              createdOp.id,
              operation.date,
              value_in.value,
              value_in.qtd,
              value_in.asset_id,
              true,
            );
          }

          if (value_out) {
            this.operationAssetsService.createOperationValue(value_out, createdOp.id, false);
            this.balanceService.updateBalance(
              operation.account_id,
              createdOp.id,
              operation.date,
              value_out.value,
              value_out.qtd,
              value_out.asset_id,
              false,
            );
          }
          return createdOp;
        })
        .then((returnOp) => {
          resolve(returnOp);
        })
        .catch(reject);
    });
  }

  async update(
    id: number,
    operation: Partial<OperationsDTO> | OperationsDTO,
  ): Promise<OperationsEntity> {
    return this.operationsRepository.save({ id, ...operation });
  }

  async delete(id: number): Promise<number> {
    return new Promise((resolve) => {
      this.operationsRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
