import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

import { AccountTypeEntity } from '@/models/account_type/entities/account_type.entity';
import { AccountTypeDTO } from '@/models/account_type/interfaces/account_type.dto';

@Injectable()
export class AccountTypeService {
  private readonly accountTypeRepository: Repository<AccountTypeEntity>;

  constructor(
    @InjectRepository(AccountTypeEntity)
    accountTypeRepository: Repository<AccountTypeEntity>,
  ) {
    this.accountTypeRepository = accountTypeRepository;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<AccountTypeEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.accountTypeRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.accountTypeRepository.createQueryBuilder('account_type');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<AccountTypeEntity> {
    return this.accountTypeRepository.findOneBy({ id });
  }

  async create(accountType: Partial<AccountTypeDTO>): Promise<AccountTypeEntity> {
    return this.accountTypeRepository.save(accountType);
  }

  async update(
    id: number,
    accountType: Partial<AccountTypeDTO> | AccountTypeDTO,
  ): Promise<AccountTypeEntity> {
    return this.accountTypeRepository.save({ id, ...accountType });
  }

  async delete(id: number | number[]): Promise<number | number[]> {
    return new Promise((resolve) => {
      this.accountTypeRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
