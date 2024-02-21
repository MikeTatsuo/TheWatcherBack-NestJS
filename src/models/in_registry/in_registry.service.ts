import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { INRegistryEntity } from '@/models/in_registry/entities/in_registry.entity';
import { INRegistryDTO } from '@/models/in_registry/interfaces/in_registry.dto';

@Injectable()
export class INRegistryService {
  private readonly inRegistryRepository: Repository<INRegistryEntity>;

  constructor(
    @InjectRepository(INRegistryEntity)
    inRegistryRepository: Repository<INRegistryEntity>,
  ) {
    this.inRegistryRepository = inRegistryRepository;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<INRegistryEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.inRegistryRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.inRegistryRepository.createQueryBuilder('in_registry');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<INRegistryEntity> {
    return this.inRegistryRepository.findOneBy({ id });
  }

  async getByCode(registry_code: number): Promise<INRegistryEntity> {
    return this.inRegistryRepository.findOneBy({ registry_code });
  }

  async getByHierarchy(
    registry_hierarchy: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<INRegistryEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.inRegistryRepository
        .find({
          where: { registry_hierarchy },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.inRegistryRepository.countBy({ registry_hierarchy }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async create(inRegistry: Partial<INRegistryDTO>): Promise<INRegistryEntity> {
    return this.inRegistryRepository.save(inRegistry);
  }

  async update(
    id: number,
    inRegistry: Partial<INRegistryDTO> | INRegistryDTO,
  ): Promise<INRegistryEntity> {
    return this.inRegistryRepository.save({ id, ...inRegistry });
  }

  async delete(id: number): Promise<number> {
    return new Promise((resolve) => {
      this.inRegistryRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
