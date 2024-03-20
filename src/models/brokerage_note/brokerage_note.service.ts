import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { BrokerageNoteEntity } from './entities/brokerage_note.entity';
import { BrokerageNoteDTO } from './interfaces/brokerage_note.dto';

const relations = ['account'];
const select = {
  id: true,
  date: true,
  account: { name: true },
};

@Injectable()
export class BrokerageNoteService {
  private readonly brokerageNoteRepository: Repository<BrokerageNoteEntity>;

  constructor(
    @InjectRepository(BrokerageNoteEntity)
    BrokerageNoteRepository: Repository<BrokerageNoteEntity>,
  ) {
    this.brokerageNoteRepository = BrokerageNoteRepository;
  }

  async getAll(
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<BrokerageNoteEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.brokerageNoteRepository
        .find({
          take: per_page,
          skip,
          order: { date: 'DESC', [order_by]: order },
          relations,
          select,
        })
        .then((entities) => {
          const queryBuilder = this.brokerageNoteRepository.createQueryBuilder('brokerage_note');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<BrokerageNoteEntity> {
    return this.brokerageNoteRepository.findOne({ where: { id }, relations, select });
  }

  async getByAccount(
    account_id: number,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<BrokerageNoteEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.brokerageNoteRepository
        .find({
          take: per_page,
          skip,
          order: { date: 'DESC', [order_by]: order },
          relations,
          select,
          where: { account_id },
        })
        .then((entities) => {
          return Promise.all([
            this.brokerageNoteRepository.countBy({ account_id }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getByDate(
    date: Date,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginationDTO<BrokerageNoteEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.brokerageNoteRepository
        .find({
          where: { date },
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          return Promise.all([
            this.brokerageNoteRepository.countBy({ date }),
            Promise.resolve(entities),
          ]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async create(brokerageNote: BrokerageNoteDTO): Promise<BrokerageNoteEntity> {
    return this.brokerageNoteRepository.save(brokerageNote);
  }

  async update(
    id: number,
    brokerageNoteData: Partial<BrokerageNoteDTO>,
  ): Promise<BrokerageNoteEntity> {
    return this.brokerageNoteRepository.save({ id, ...brokerageNoteData });
  }

  async delete(id: number | number[]): Promise<number | number[]> {
    return new Promise((resolve) => {
      this.brokerageNoteRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
