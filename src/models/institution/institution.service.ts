import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { InstitutionEntity } from '@/models/institution/entities/institution.entity';
import { InstitutionDTO } from '@/models/institution/interfaces/institution.dto';

@Injectable()
export class InstitutionService {
  private readonly institutionRepository: Repository<InstitutionEntity>;

  constructor(
    @InjectRepository(InstitutionEntity)
    institutionRepository: Repository<InstitutionEntity>,
  ) {
    this.institutionRepository = institutionRepository;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<InstitutionEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.institutionRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.institutionRepository.createQueryBuilder('institution');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<InstitutionEntity> {
    return this.institutionRepository.findOneBy({ id });
  }

  async getByInstitutionType(
    institution_type_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<InstitutionEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.institutionRepository
        .find({
          where: { institution_type_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.institutionRepository.countBy({ institution_type_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getByCountry(
    country_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<InstitutionEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.institutionRepository
        .find({
          where: { country_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.institutionRepository.countBy({ country_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async create(institution: Partial<InstitutionDTO>): Promise<InstitutionEntity> {
    return this.institutionRepository.save(institution);
  }

  async update(
    id: number,
    institution: Partial<InstitutionDTO> | InstitutionDTO,
  ): Promise<InstitutionEntity> {
    return this.institutionRepository.save({ id, ...institution });
  }

  async delete(id: number): Promise<number> {
    return new Promise((resolve) => {
      this.institutionRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
