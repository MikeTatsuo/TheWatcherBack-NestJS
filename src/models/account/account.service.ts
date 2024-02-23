import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { AccountEntity } from '@/models/account/entities/account.entity';
import { AccountDTO } from '@/models/account/interfaces/account.dto';

@Injectable()
export class AccountService {
  private readonly accountRepository: Repository<AccountEntity>;

  constructor(
    @InjectRepository(AccountEntity)
    accountRepository: Repository<AccountEntity>,
  ) {
    this.accountRepository = accountRepository;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<AccountEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.accountRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.accountRepository.createQueryBuilder('operation_type');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<AccountEntity> {
    return this.accountRepository.findOne({
      where: { id },
    });
  }

  async getByInstitution(
    institution_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<AccountEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.accountRepository
        .find({
          where: { institution_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.accountRepository.countBy({ institution_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getByAccountType(
    account_type_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<AccountEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.accountRepository
        .find({
          where: { account_type_id },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.accountRepository.countBy({ account_type_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async create(account: Partial<AccountDTO>): Promise<AccountEntity> {
    return this.accountRepository.save(account);
  }

  async update(id: number, account: Partial<AccountDTO> | AccountDTO): Promise<AccountEntity> {
    return this.accountRepository.save({ id, ...account });
  }

  async delete(id: number | number[]): Promise<number | number[]> {
    return new Promise((resolve) => {
      this.accountRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
