import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { CountryEntity } from '@/models/country/entities/country.entity';
import { CountryDTO } from '@/models/country/interfaces/country.dto';

@Injectable()
export class CountryService {
  private readonly countryRepository: Repository<CountryEntity>;

  constructor(
    @InjectRepository(CountryEntity)
    countryRepository: Repository<CountryEntity>,
  ) {
    this.countryRepository = countryRepository;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<CountryEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.countryRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.countryRepository.createQueryBuilder('country');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<CountryEntity> {
    return this.countryRepository.findOneBy({ id });
  }

  async getByCode(country_code: string): Promise<CountryEntity> {
    const code = country_code.toUpperCase();
    return this.countryRepository.findOneBy({ code });
  }

  async getByName(country: string): Promise<CountryEntity> {
    return this.countryRepository.findOneBy({ country });
  }

  async create(country: Partial<CountryDTO>): Promise<CountryEntity> {
    return this.countryRepository.save(country);
  }

  async update(id: number, country: Partial<CountryDTO> | CountryDTO): Promise<CountryEntity> {
    return this.countryRepository.save({ id, ...country });
  }

  async delete(id: number | number[]): Promise<number | number[]> {
    return new Promise((resolve) => {
      this.countryRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
