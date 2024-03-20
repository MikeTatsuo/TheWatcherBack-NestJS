import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { TransfersEntity } from '@/models/transfers/entities/transfers.entity';
import { TransfersDTO } from '@/models/transfers/interfaces/transfers.dto';
import { OperationsService } from '../operations/operations.service';
import { BalanceService } from '../balance/balance.service';
import { ValueHelper } from '@/common/helpers/value.helper';

const relations = [
  'operation_out',
  'operation_out.operation_type',
  'operation_out.operation_type.in_operation_code',
  'operation_out.operation_type.in_registry',
  'operation_out.account',
  'operation_out.account.institution',
  'operation_out.account.institution.institution_type',
  'operation_out.account.institution.country',
  'operation_out.account.account_type',
  'operation_out.ni_type',
  'operation_in',
  'operation_in.operation_type',
  'operation_in.operation_type.in_operation_code',
  'operation_in.operation_type.in_registry',
  'operation_in.account',
  'operation_in.account.institution',
  'operation_in.account.institution.institution_type',
  'operation_in.account.institution.country',
  'operation_in.account.account_type',
  'operation_in.ni_type',
];
const select = {
  id: true,
  operation_out: {
    date: true,
    description: true,
    operation_type: {
      operation_type: true,
      operation_code: true,
      in_operation_code: { in_operation: true, in_operation_code: true },
      in_registry: { registry_code: true, description: true, registry_hierarchy: true },
    },
    account: {
      name: true,
      institution: {
        institution: true,
        url: true,
        institution_type: { institution_type: true },
        country: { code: true, country: true },
      },
      account_type: { account_type: true },
    },
    ni_type: { ni_type: true, ni_code: true },
  },
  operation_in: {
    date: true,
    description: true,
    operation_type: {
      operation_type: true,
      operation_code: true,
      in_operation_code: { in_operation: true, in_operation_code: true },
      in_registry: { registry_code: true, description: true, registry_hierarchy: true },
    },
    account: {
      name: true,
      institution: {
        institution: true,
        url: true,
        institution_type: { institution_type: true },
        country: { code: true, country: true },
      },
      account_type: { account_type: true },
    },
    ni_type: { ni_type: true, ni_code: true },
  },
};

@Injectable()
export class TransfersService {
  private readonly transfersRepository: Repository<TransfersEntity>;
  private readonly balanceService: BalanceService;
  private readonly operationsService: OperationsService;

  constructor(
    @InjectRepository(TransfersEntity)
    transfersRepository: Repository<TransfersEntity>,
    balanceService: BalanceService,
    operationsService: OperationsService,
  ) {
    this.transfersRepository = transfersRepository;
    this.balanceService = balanceService;
    this.operationsService = operationsService;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<TransfersEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.transfersRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
          relations,
          select,
        })
        .then((entities) => {
          const queryBuilder = this.transfersRepository.createQueryBuilder('transfers');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<TransfersEntity> {
    return this.transfersRepository.findOneBy({ id });
  }

  async create({
    qtd,
    asset_id,
    operation_out_account_id,
    operation_out_date,
    operation_out_ni_type,
    operation_in_account_id,
    operation_in_date,
    operation_in_ni_type,
  }: TransfersDTO): Promise<TransfersEntity> {
    return new Promise((resolve) => {
      this.balanceService
        .getByAccountAndAsset(operation_out_account_id, asset_id)
        .then((balance) => {
          const balance_qtd = Number(balance.qtd);
          const balance_value = Number(balance.value);

          const transfer_value = ValueHelper.getValueByQtd(qtd, balance_qtd, balance_value);
          const transfer_in_value = ValueHelper.correctValue(transfer_value, true);
          const transfer_out_value = ValueHelper.correctValue(transfer_value, false);
          const transfer_in_qtd = ValueHelper.correctQtd(qtd, true);
          const transfer_out_qtd = ValueHelper.correctQtd(qtd, false);
          const value_in = { value: transfer_in_value, qtd: transfer_in_qtd, asset_id };
          const value_out = { value: transfer_out_value, qtd: transfer_out_qtd, asset_id };

          const operation_in = {
            operation_type_id: 11,
            account_id: operation_in_account_id,
            ni_type_id: operation_in_ni_type,
            description: 'Recebimento de transferência',
            date: operation_in_date,
            value_in,
          };

          const operation_out = {
            operation_type_id: 12,
            account_id: operation_out_account_id,
            ni_type_id: operation_out_ni_type,
            description: 'Envio de transferência',
            date: operation_out_date,
            value_out,
          };

          return Promise.all([
            this.operationsService.create(operation_out),
            this.operationsService.create(operation_in),
          ]);
        })
        .then(([op_out, op_in]) => {
          resolve(
            this.transfersRepository.save({
              operation_out_id: op_out.id,
              operation_in_id: op_in.id,
            }),
          );
        });
    });
  }

  async update(
    id: number,
    updateTransferData: Partial<TransfersEntity> | TransfersEntity,
  ): Promise<TransfersEntity> {
    return this.transfersRepository.save({ id, ...updateTransferData });
  }

  async delete(id: number | number[]): Promise<number | number[]> {
    return new Promise((resolve) => {
      this.transfersRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
