import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { InstitutionTypeEntity } from '@/models/institution_type/entities/institution_type.entity';
import { InstitutionTypeDTO } from '@/models/institution_type/interfaces/institution_type.dto';

@Injectable()
export class InstitutionTypeService {
  private readonly institutionTypeRepository: Repository<InstitutionTypeEntity>;

  constructor(
    @InjectRepository(InstitutionTypeEntity)
    institutionTypeRepository: Repository<InstitutionTypeEntity>,
  ) {
    this.institutionTypeRepository = institutionTypeRepository;
  }

  async getAll(
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<InstitutionTypeEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.institutionTypeRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.institutionTypeRepository.createQueryBuilder('operation_type');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<InstitutionTypeEntity> {
    return this.institutionTypeRepository.findOneBy({ id });
  }

  async create(institutionType: Partial<InstitutionTypeDTO>): Promise<InstitutionTypeEntity> {
    return this.institutionTypeRepository.save(institutionType);
  }

  async update(
    id: number,
    institutionType: Partial<InstitutionTypeDTO> | InstitutionTypeDTO,
  ): Promise<InstitutionTypeEntity> {
    return this.institutionTypeRepository.save({ id, ...institutionType });
  }

  async delete(id: number): Promise<number> {
    return new Promise((resolve) => {
      this.institutionTypeRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
