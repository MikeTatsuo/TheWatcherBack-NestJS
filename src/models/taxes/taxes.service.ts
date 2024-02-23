import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { ValuesService } from '@/models/values/values.service';

import { TaxesEntity } from '@/models/taxes/entities/taxes.entity';
import { TaxesDTO } from '@/models/taxes/interfaces/taxes.dto';

@Injectable()
export class TaxesService {
  private readonly taxesRepository: Repository<TaxesEntity>;
  private readonly valuesService: ValuesService;

  constructor(
    @InjectRepository(TaxesEntity)
    taxesRepository: Repository<TaxesEntity>,
    valuesService: ValuesService,
  ) {
    this.taxesRepository = taxesRepository;
    this.valuesService = valuesService;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<TaxesEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.taxesRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.taxesRepository.createQueryBuilder('taxes');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<TaxesEntity> {
    return this.taxesRepository.findOneBy({ id });
  }

  async getByTaxType(
    tax_type_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<TaxesEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.taxesRepository
        .find({
          where: { tax_type_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.taxesRepository.countBy({ tax_type_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getByOperation(
    operation_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<TaxesEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.taxesRepository
        .find({
          where: { operation_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.taxesRepository.countBy({ operation_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async create({ value, qtd, asset_id, ...taxes }: TaxesDTO): Promise<TaxesEntity> {
    return new Promise((resolve) => {
      this.valuesService.create({ asset_id, value, qtd }).then(({ id: value_id }) => {
        resolve(this.taxesRepository.save({ ...taxes, value_id }));
      });
    });
  }

  async update(
    id: number,
    { value, asset_id, qtd, ...taxes }: Partial<TaxesDTO> | TaxesDTO,
  ): Promise<TaxesEntity> {
    return new Promise((resolve) => {
      this.taxesRepository
        .findOneBy({ id })
        .then((tax) => {
          const valueData = {};
          if (value) Object.assign(valueData, { ...valueData, value });
          if (asset_id) Object.assign(valueData, { ...valueData, asset_id });
          if (qtd) Object.assign(valueData, { ...valueData, qtd });
          return this.valuesService.update(tax.value_id, valueData);
        })
        .then(() => {
          resolve(this.taxesRepository.save({ id, ...taxes }));
        });
    });
  }

  async delete(id: number | number[]): Promise<number | number[]> {
    return new Promise((resolve) => {
      this.taxesRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
