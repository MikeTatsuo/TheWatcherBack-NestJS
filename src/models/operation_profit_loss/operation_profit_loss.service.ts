import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { ValuesService } from '@/models/values/values.service';

import { OperationProfitLossEntity } from '@/models/operation_profit_loss/entities/operation_profit_loss.entity';
import { OperationProfitLossDTO } from '@/models/operation_profit_loss/interfaces/operation_profit_loss.dto';

@Injectable()
export class OperationProfitLossService {
  private readonly operationProfitLossRepository: Repository<OperationProfitLossEntity>;
  private readonly valuesService: ValuesService;

  constructor(
    @InjectRepository(OperationProfitLossEntity)
    OperationProfitLossRepository: Repository<OperationProfitLossEntity>,
    valuesService: ValuesService,
  ) {
    this.operationProfitLossRepository = OperationProfitLossRepository;
    this.valuesService = valuesService;
  }

  async getAll(
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationProfitLossEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.operationProfitLossRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder =
            this.operationProfitLossRepository.createQueryBuilder('operation_profit_loss');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<OperationProfitLossEntity> {
    return this.operationProfitLossRepository.findOneBy({ id });
  }

  async getByOperation(operation_id: number): Promise<OperationProfitLossEntity> {
    return this.operationProfitLossRepository.findOneBy({ operation_id });
  }

  async create({
    operation_id,
    asset_id,
    value,
  }: OperationProfitLossDTO): Promise<OperationProfitLossEntity> {
    return new Promise((resolve) => {
      this.valuesService.create({ asset_id, value }).then(({ id: value_id }) => {
        resolve(this.operationProfitLossRepository.save({ value_id, operation_id }));
      });
    });
  }

  async update(
    id: number,
    { operation_id, ...valueData }: Partial<OperationProfitLossDTO> | OperationProfitLossDTO,
  ): Promise<OperationProfitLossEntity> {
    return new Promise((resolve) => {
      this.operationProfitLossRepository.findOneBy({ id }).then(({ value_id }) => {
        if (valueData) this.valuesService.update(value_id, { ...valueData });
        if (operation_id) this.operationProfitLossRepository.save({ id, operation_id });

        resolve(this.operationProfitLossRepository.findOneBy({ id }));
      });
    });
  }

  async delete(id: number): Promise<number> {
    return new Promise((resolve) => {
      this.operationProfitLossRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
