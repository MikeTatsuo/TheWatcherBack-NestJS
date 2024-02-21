import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { INOperationTypeEntity } from '@/models/in_operation_type/entities/in_operation_type.entity';
import { INOperationTypeDTO } from '@/models/in_operation_type/interfaces/in_operation_type.dto';

@Injectable()
export class INOperationTypeService {
  private readonly inOperationTypeRepository: Repository<INOperationTypeEntity>;

  constructor(
    @InjectRepository(INOperationTypeEntity)
    inOperationTypeRepository: Repository<INOperationTypeEntity>,
  ) {
    this.inOperationTypeRepository = inOperationTypeRepository;
  }

  async getAll(
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<INOperationTypeEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.inOperationTypeRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.inOperationTypeRepository.createQueryBuilder('operation_type');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<INOperationTypeEntity> {
    return this.inOperationTypeRepository.findOneBy({ id });
  }

  async getByCode(in_operation_code: string): Promise<INOperationTypeEntity> {
    return this.inOperationTypeRepository.findOneBy({ in_operation_code });
  }

  async create(inOperationType: Partial<INOperationTypeDTO>): Promise<INOperationTypeEntity> {
    return this.inOperationTypeRepository.save(inOperationType);
  }

  async update(
    id: number,
    inOperationType: Partial<INOperationTypeDTO> | INOperationTypeDTO,
  ): Promise<INOperationTypeEntity> {
    return this.inOperationTypeRepository.save({ id, ...inOperationType });
  }

  async delete(id: number): Promise<number> {
    return new Promise((resolve) => {
      this.inOperationTypeRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
