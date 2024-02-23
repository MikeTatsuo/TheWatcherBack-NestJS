import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { NiTypeEntity } from '@/models/ni_type/entities/ni_type.entity';
import { NiTypeDTO } from '@/models/ni_type/interfaces/ni_type.dto';

@Injectable()
export class NiTypeService {
  private readonly niTypeRepository: Repository<NiTypeEntity>;

  constructor(
    @InjectRepository(NiTypeEntity)
    niTypeRepository: Repository<NiTypeEntity>,
  ) {
    this.niTypeRepository = niTypeRepository;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<NiTypeEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.niTypeRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.niTypeRepository.createQueryBuilder('ni_type');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<NiTypeEntity> {
    return this.niTypeRepository.findOneBy({ id });
  }

  async getByCode(ni_code: number): Promise<NiTypeEntity> {
    return this.niTypeRepository.findOneBy({ ni_code });
  }

  async create(niType: Partial<NiTypeDTO>): Promise<NiTypeEntity> {
    return this.niTypeRepository.save(niType);
  }

  async update(id: number, niType: Partial<NiTypeDTO> | NiTypeDTO): Promise<NiTypeEntity> {
    return this.niTypeRepository.save({ id, ...niType });
  }

  async delete(id: number | number[]): Promise<number | number[]> {
    return new Promise((resolve) => {
      this.niTypeRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
