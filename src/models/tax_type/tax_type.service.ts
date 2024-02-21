import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { TaxTypeEntity } from '@/models/tax_type/entities/tax_type.entity';
import { TaxTypeDTO } from '@/models/tax_type/interfaces/tax_type.dto';

@Injectable()
export class TaxTypeService {
  private readonly taxTypeRepository: Repository<TaxTypeEntity>;

  constructor(
    @InjectRepository(TaxTypeEntity)
    taxTypeRepository: Repository<TaxTypeEntity>,
  ) {
    this.taxTypeRepository = taxTypeRepository;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<TaxTypeEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.taxTypeRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.taxTypeRepository.createQueryBuilder('operation_type');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<TaxTypeEntity> {
    return this.taxTypeRepository.findOneBy({ id });
  }

  async create(taxType: Partial<TaxTypeDTO>): Promise<TaxTypeEntity> {
    return this.taxTypeRepository.save(taxType);
  }

  async update(id: number, taxType: Partial<TaxTypeDTO> | TaxTypeDTO): Promise<TaxTypeEntity> {
    return this.taxTypeRepository.save({ id, ...taxType });
  }

  async delete(id: number): Promise<number> {
    return new Promise((resolve) => {
      this.taxTypeRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
