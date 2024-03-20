import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

// import { createTransfersMock, transfersMock } from '@Mocks/transfers';
import { transfersMock } from '@Mocks/transfers';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { TransfersController } from '@/models/transfers/transfers.controller';
import { TransfersService } from '@/models/transfers/transfers.service';
import { TransfersEntity } from '@/models/transfers/entities/transfers.entity';
import { BalanceService } from '../balance/balance.service';
import { OperationsService } from '../operations/operations.service';
import { BalanceEntity } from '../balance/entities/balance.entity';
import { ValuesService } from '../values/values.service';
import { OperationsEntity } from '../operations/entities/operations.entity';
import { OperationAssetsService } from '../operation_assets/operation_assets.service';
import { OperationAssetsEntity } from '../operation_assets/entities/operation_assets.entity';
import { ValuesEntity } from '../values/entities/values.entity';
import { balanceMock } from '@Mocks/balance';
import { operationsMock } from '@Mocks/operations';
import { operationAssetsMock } from '@Mocks/operation_assets';
import { valuesMock } from '@Mocks/values';

const mockList = MockHelper.generateList(transfersMock);
const balanceMockList = MockHelper.generateList(balanceMock);
const operationsMockList = MockHelper.generateList(operationsMock);
const operationAssetsMockList = MockHelper.generateList(operationAssetsMock);
const valueMockList = MockHelper.generateList(valuesMock);
// const createMockItem = createTransfersMock();
const useValue = TestHelper(mockList);
const balanceUseValue = TestHelper(balanceMockList);
const operationsUseValue = TestHelper(operationsMockList);
const operationAssetsUseValue = TestHelper(operationAssetsMockList);
const valuesUseValue = TestHelper(valueMockList);
const mockLength = mockList.length;
const paginationData = new PaginationOptionsDTO();
const { page, per_page } = paginationData;

describe('TransfersController', () => {
  let transfersController: TransfersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [
        BalanceService,
        TransfersService,
        OperationsService,
        OperationAssetsService,
        ValuesService,
        {
          provide: getRepositoryToken(BalanceEntity),
          useValue: balanceUseValue,
        },
        {
          provide: getRepositoryToken(TransfersEntity),
          useValue,
        },
        {
          provide: getRepositoryToken(OperationsEntity),
          useValue: operationsUseValue,
        },
        {
          provide: getRepositoryToken(OperationAssetsEntity),
          useValue: operationAssetsUseValue,
        },
        {
          provide: getRepositoryToken(ValuesEntity),
          useValue: valuesUseValue,
        },
      ],
    }).compile();

    transfersController = app.get<TransfersController>(TransfersController);
  });

  describe('/transfers - GET', () => {
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of transfers list', () => {
      return transfersController.getAll(paginationData).then((transfersList) => {
        expect(transfersList).not.toBeNull();
        expect(transfersList).not.toBeUndefined();
        expect(transfersList.data).not.toBeNull();
        expect(transfersList.data).not.toBeUndefined();
        expect(transfersList.page).toBe(page);
        expect(transfersList.perPage).toBe(per_page);
        expect(transfersList.total).toBe(mockLength);
        expect(transfersList.pageCount).toBe(pageCount);
        if (page > 1) expect(transfersList.hasPreviousPage).toBeTruthy();
        else expect(transfersList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(transfersList.hasNextPage).toBeTruthy();
        else expect(transfersList.hasNextPage).toBeFalsy();
        expect(transfersList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/transfers/by_id/:transfer_id - GET', () => {
    const { id, operation_in_id, operation_out_id } = faker.helpers.arrayElement(mockList);
    it(`should return transfer with id=${id}`, () => {
      return transfersController.getById(id).then((transfers) => {
        expect(transfers).not.toBeNull();
        expect(transfers).not.toBeUndefined();
        expect(transfers.id).toBe(id);
        expect(transfers.operation_in_id).toBe(operation_in_id);
        expect(transfers.operation_out_id).toBe(operation_out_id);
      });
    });
  });

  // describe('/transfers - POST', () => {
  //   it('should create transfers', () => {
  //     return transfersController.createTransfers(createMockItem).then((transfers) => {
  //       expect(transfers).not.toBeNull();
  //       expect(transfers).not.toBeUndefined();
  //       expect(transfers.id).toBe(mockLength);
  //     });
  //   });
  // });

  describe('/transfers/:transfers_id - PUT', () => {
    const mockItem = faker.helpers.arrayElement(mockList);
    const { operation_in_id, operation_out_id } = transfersMock();

    it(`should update transfers with id=${mockItem.id}`, () => {
      return transfersController
        .updateTransfers(mockItem.id, { operation_in_id, operation_out_id })
        .then((transfers) => {
          expect(transfers).not.toBeNull();
          expect(transfers).not.toBeUndefined();
          expect(transfers.id).toBe(mockItem.id);
          expect(transfers.operation_out_id).toBe(operation_out_id);
          expect(transfers.operation_in_id).toBe(operation_in_id);
        });
    });
  });

  describe('/transfers/:transfers_id - PATCH', () => {
    const mockItem = faker.helpers.arrayElement(mockList);
    const { operation_in_id, operation_out_id } = transfersMock();

    it(`should partially update transfers with id=${mockItem.id} - only operation_in_id`, () => {
      return transfersController
        .partialUpdateTransfers(mockItem.id, { operation_in_id })
        .then((transfers) => {
          expect(transfers).not.toBeNull();
          expect(transfers).not.toBeUndefined();
          expect(transfers.id).toBe(mockItem.id);
          expect(transfers.operation_in_id).toBe(operation_in_id);
          expect(transfers.operation_out_id).toBe(mockItem.operation_out_id);
        });
    });
    it(`should partially update transfers with id=${mockItem.id} - only operation_out_id`, () => {
      return transfersController
        .partialUpdateTransfers(mockItem.id, { operation_out_id })
        .then((transfers) => {
          expect(transfers).not.toBeNull();
          expect(transfers).not.toBeUndefined();
          expect(transfers.id).toBe(mockItem.id);
          expect(transfers.operation_out_id).toBe(operation_out_id);
          expect(transfers.operation_in_id).toBe(mockItem.operation_in_id);
        });
    });
  });

  describe('/transfers/:transfers_id - DELETE', () => {
    const transfersId = faker.helpers.arrayElement(mockList).id;

    it(`should delete transfers with id=${transfersId}`, () => {
      return transfersController.deleteTransfers(transfersId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
