import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { OperationTypeEntity } from '@/models/operation_type/entities/operation_type.entity';
import { OperationTypeDTO } from '@/models/operation_type/interfaces/operation_type.dto';

@Injectable()
export class OperationTypeService {
  private readonly operationTypeRepository: Repository<OperationTypeEntity>;

  constructor(
    @InjectRepository(OperationTypeEntity)
    OperationTypeRepository: Repository<OperationTypeEntity>,
  ) {
    this.operationTypeRepository = OperationTypeRepository;
  }

  async getAll(
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationTypeEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.operationTypeRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.operationTypeRepository.createQueryBuilder('operation_type');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<OperationTypeEntity> {
    return this.operationTypeRepository.findOneBy({ id });
  }

  async getByCode(operation_code: string): Promise<OperationTypeEntity> {
    return this.operationTypeRepository.findOneBy({ operation_code });
  }

  async getByINOperationType(
    in_operation_type_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationTypeEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.operationTypeRepository
        .find({
          where: { in_operation_type_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.operationTypeRepository.countBy({ in_operation_type_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getByINRegistryId(
    in_registry_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<OperationTypeEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.operationTypeRepository
        .find({
          where: { in_registry_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.operationTypeRepository.countBy({ in_registry_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async create(operationType: OperationTypeDTO): Promise<OperationTypeEntity> {
    return this.operationTypeRepository.save(operationType);
  }

  async update(
    id: number,
    operationType: Partial<OperationTypeDTO> | OperationTypeDTO,
  ): Promise<OperationTypeEntity> {
    return this.operationTypeRepository.save({ id, ...operationType });
  }

  async delete(id: number): Promise<number> {
    return new Promise((resolve) => {
      this.operationTypeRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
