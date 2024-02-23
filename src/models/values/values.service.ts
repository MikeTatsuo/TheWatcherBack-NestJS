import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { ValuesEntity } from '@/models/values/entities/values.entity';
import { ValuesDTO } from '@/models/values/interfaces/values.dto';

const relations = ['asset'];
const select = {
  id: true,
  value: true,
  qtd: true,
  asset: {
    ticker: true,
    asset: true,
  },
};

@Injectable()
export class ValuesService {
  private readonly valuesRepository: Repository<ValuesEntity>;

  constructor(
    @InjectRepository(ValuesEntity)
    valuesRepository: Repository<ValuesEntity>,
  ) {
    this.valuesRepository = valuesRepository;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<ValuesEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.valuesRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
          select,
          relations,
        })
        .then((entities) => {
          const queryBuilder = this.valuesRepository.createQueryBuilder('values');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<ValuesEntity> {
    return this.valuesRepository.findOne({ where: { id }, relations, select });
  }

  async getByAsset(
    asset_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<ValuesEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.valuesRepository
        .find({
          where: { asset_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
          relations,
          select,
        })
        .then((entities) => {
          return Promise.all([
            this.valuesRepository.countBy({ asset_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async create(value: ValuesDTO): Promise<ValuesEntity> {
    return this.valuesRepository.save(value);
  }

  async batchCreate(value: ValuesDTO[]): Promise<ValuesEntity[]> {
    return this.valuesRepository.save(value);
  }

  async update(id: number, value: Partial<ValuesDTO> | ValuesDTO): Promise<ValuesEntity> {
    return this.valuesRepository.save({ id, ...value });
  }

  async delete(id: number | number[]): Promise<number | number[]> {
    return new Promise((resolve) => {
      this.valuesRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
