import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

// import { createOperationsMock, operationsMock } from '@Mocks/operations';
import { operationsMock } from '@Mocks/operations';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { OperationAssetsService } from '@/models/operation_assets/operation_assets.service';
import { OperationAssetsEntity } from '@/models/operation_assets/entities/operation_assets.entity';
import { BalanceService } from '@/models/balance/balance.service';
import { BalanceEntity } from '@/models/balance/entities/balance.entity';
import { AssetsEntity } from '@/models/assets/entities/assets.entity';
import { AssetsService } from '@/models/assets/assets.service';
import { ValuesService } from '@/models/values/values.service';
import { ValuesEntity } from '@/models/values/entities/values.entity';

import { OperationsController } from '@/models/operations/operations.controller';
import { OperationsService } from '@/models/operations/operations.service';
import { OperationsEntity } from '@/models/operations/entities/operations.entity';

const mockList = MockHelper.generateList(operationsMock);
const mockItem = operationsMock();
// const createMockItem = createOperationsMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;
const paginationData = new PaginationOptionsDTO();
const { page, per_page } = paginationData;

describe('OperationsController', () => {
  let operationsController: OperationsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OperationsController],
      providers: [
        OperationsService,
        OperationAssetsService,
        BalanceService,
        AssetsService,
        ValuesService,
        {
          provide: getRepositoryToken(OperationsEntity),
          useValue,
        },
        {
          provide: getRepositoryToken(OperationAssetsEntity),
          useValue,
        },
        {
          provide: getRepositoryToken(BalanceEntity),
          useValue,
        },
        {
          provide: getRepositoryToken(AssetsEntity),
          useValue,
        },
        {
          provide: getRepositoryToken(ValuesEntity),
          useValue,
        },
      ],
    }).compile();

    operationsController = app.get<OperationsController>(OperationsController);
  });

  describe('/operations - GET', () => {
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of operations list', () => {
      return operationsController.getAll(paginationData).then((operationsList) => {
        expect(operationsList).not.toBeNull();
        expect(operationsList).not.toBeUndefined();
        expect(operationsList.data).not.toBeNull();
        expect(operationsList.data).not.toBeUndefined();
        expect(operationsList.page).toBe(page);
        expect(operationsList.perPage).toBe(per_page);
        expect(operationsList.total).toBe(mockLength);
        expect(operationsList.pageCount).toBe(pageCount);
        if (page > 1) expect(operationsList.hasPreviousPage).toBeTruthy();
        else expect(operationsList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(operationsList.hasNextPage).toBeTruthy();
        else expect(operationsList.hasNextPage).toBeFalsy();
        expect(operationsList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/operations/by_id/:operations_id - GET', () => {
    const { id, operation_type_id, account_id, ni_type_id, description, date } =
      faker.helpers.arrayElement(mockList);

    it(`should return operations with id=${id}`, () => {
      return operationsController.getById(id).then((operations) => {
        expect(operations).not.toBeNull();
        expect(operations).not.toBeUndefined();
        expect(operations.operation_type_id).toBe(operation_type_id);
        expect(operations.account_id).toBe(account_id);
        expect(operations.ni_type_id).toBe(ni_type_id);
        expect(operations.description).toBe(description);
        expect(operations.date).toBe(date);
        expect(operations.id).toBe(id);
      });
    });
  });

  describe('/operations/by_operation_type/:operation_type_id - GET', () => {
    const { operation_type_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter(
      (item) => item.operation_type_id === operation_type_id,
    ).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return operations with code=${operation_type_id}`, () => {
      return operationsController
        .getByOperationType(operation_type_id, paginationData)
        .then((operations) => {
          expect(operations).not.toBeNull();
          expect(operations).not.toBeUndefined();
          expect(operations.data).not.toBeNull();
          expect(operations.data).not.toBeUndefined();
          expect(operations.page).toBe(page);
          expect(operations.perPage).toBe(per_page);
          expect(operations.total).toBe(sampleLength);
          expect(operations.pageCount).toBe(pageCount);
          if (page > 1) expect(operations.hasPreviousPage).toBeTruthy();
          else expect(operations.hasPreviousPage).toBeFalsy();
          if (pageCount > 1 && pageCount !== page) expect(operations.hasNextPage).toBeTruthy();
          else expect(operations.hasNextPage).toBeFalsy();
          expect(operations.data.length).toBe(dataLength);
        });
    });
  });

  describe('/operations/by_account/:account_id - GET', () => {
    const { account_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.account_id === account_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of operationss with account_id=${account_id}`, () => {
      return operationsController.getByAccount(account_id, paginationData).then((operations) => {
        expect(operations).not.toBeNull();
        expect(operations).not.toBeUndefined();
        expect(operations.data).not.toBeNull();
        expect(operations.data).not.toBeUndefined();
        expect(operations.page).toBe(page);
        expect(operations.perPage).toBe(per_page);
        expect(operations.total).toBe(sampleLength);
        expect(operations.pageCount).toBe(pageCount);
        if (page > 1) expect(operations.hasPreviousPage).toBeTruthy();
        else expect(operations.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(operations.hasNextPage).toBeTruthy();
        else expect(operations.hasNextPage).toBeFalsy();
        expect(operations.data.length).toBe(dataLength);
      });
    });
  });

  describe('/operations/by_ni_type/:ni_type_id - GET', () => {
    const { ni_type_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.ni_type_id === ni_type_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of operationss with ni_type_id=${ni_type_id}`, () => {
      return operationsController.getByNIType(ni_type_id, paginationData).then((operations) => {
        expect(operations).not.toBeNull();
        expect(operations).not.toBeUndefined();
        expect(operations.data).not.toBeNull();
        expect(operations.data).not.toBeUndefined();
        expect(operations.page).toBe(page);
        expect(operations.perPage).toBe(per_page);
        expect(operations.total).toBe(sampleLength);
        expect(operations.pageCount).toBe(pageCount);
        if (page > 1) expect(operations.hasPreviousPage).toBeTruthy();
        else expect(operations.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(operations.hasNextPage).toBeTruthy();
        else expect(operations.hasNextPage).toBeFalsy();
        expect(operations.data.length).toBe(dataLength);
      });
    });
  });

  describe('/operations/by_date/:date - GET', () => {
    const { date } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.date === date).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of operationss with date=${date}`, () => {
      return operationsController.getByDate(date, paginationData).then((operations) => {
        expect(operations).not.toBeNull();
        expect(operations).not.toBeUndefined();
        expect(operations.data).not.toBeNull();
        expect(operations.data).not.toBeUndefined();
        expect(operations.page).toBe(page);
        expect(operations.perPage).toBe(per_page);
        expect(operations.total).toBe(sampleLength);
        expect(operations.pageCount).toBe(pageCount);
        if (page > 1) expect(operations.hasPreviousPage).toBeTruthy();
        else expect(operations.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(operations.hasNextPage).toBeTruthy();
        else expect(operations.hasNextPage).toBeFalsy();
        expect(operations.data.length).toBe(dataLength);
      });
    });
  });

  // describe('/operations - POST', () => {
  //   it('should create operations', () => {
  //     return operationsController.createOperation(createMockItem).then((operations) => {
  //       expect(operations).not.toBeNull();
  //       expect(operations).not.toBeUndefined();
  //       expect(operations.operation_type_id).toBe(createMockItem.operation_type_id);
  //       expect(operations.account_id).toBe(createMockItem.account_id);
  //       expect(operations.ni_type_id).toBe(createMockItem.ni_type_id);
  //       expect(operations.description).toBe(createMockItem.description);
  //       expect(operations.date).toBe(createMockItem.date);
  //       expect(operations.id).toBe(mockLength);
  //     });
  //   });
  // });

  describe('/operations/:operations_id - PUT', () => {
    const { id } = faker.helpers.arrayElement(mockList);
    it(`should update operations with id=${id}`, () => {
      return operationsController.updateOperation(id, mockItem).then((operations) => {
        expect(operations).not.toBeNull();
        expect(operations).not.toBeUndefined();
        expect(operations.operation_type_id).toBe(mockItem.operation_type_id);
        expect(operations.account_id).toBe(mockItem.account_id);
        expect(operations.ni_type_id).toBe(mockItem.ni_type_id);
        expect(operations.description).toBe(mockItem.description);
        expect(operations.date).toBe(mockItem.date);
        expect(operations.id).toBe(id);
      });
    });
  });

  describe('/operations/:operations_id - PATCH', () => {
    const mockOperations = faker.helpers.arrayElement(mockList);
    const { operation_type_id, account_id, ni_type_id, description, date } = mockItem;

    it(`should partially update operations with id=${mockOperations.id} - only operation_type_id`, () => {
      return operationsController
        .partialUpdateOperation(mockOperations.id, { operation_type_id })
        .then((operations) => {
          expect(operations).not.toBeNull();
          expect(operations).not.toBeUndefined();
          expect(operations.operation_type_id).toBe(operation_type_id);
          expect(operations.account_id).toBe(mockOperations.account_id);
          expect(operations.ni_type_id).toBe(mockOperations.ni_type_id);
          expect(operations.description).toBe(mockOperations.description);
          expect(operations.date).toBe(mockOperations.date);
          expect(operations.id).toBe(mockOperations.id);
        });
    });

    it(`should partially update operations with id=${mockOperations.id} - only account_id`, () => {
      return operationsController
        .partialUpdateOperation(mockOperations.id, { account_id })
        .then((operations) => {
          expect(operations).not.toBeNull();
          expect(operations).not.toBeUndefined();
          expect(operations.operation_type_id).toBe(mockOperations.operation_type_id);
          expect(operations.account_id).toBe(account_id);
          expect(operations.ni_type_id).toBe(mockOperations.ni_type_id);
          expect(operations.description).toBe(mockOperations.description);
          expect(operations.date).toBe(mockOperations.date);
          expect(operations.id).toBe(mockOperations.id);
        });
    });

    it(`should partially update operations with id=${mockOperations.id} - only ni_type_id`, () => {
      return operationsController
        .partialUpdateOperation(mockOperations.id, { ni_type_id })
        .then((operations) => {
          expect(operations).not.toBeNull();
          expect(operations).not.toBeUndefined();
          expect(operations.operation_type_id).toBe(mockOperations.operation_type_id);
          expect(operations.account_id).toBe(mockOperations.account_id);
          expect(operations.ni_type_id).toBe(ni_type_id);
          expect(operations.description).toBe(mockOperations.description);
          expect(operations.date).toBe(mockOperations.date);
          expect(operations.id).toBe(mockOperations.id);
        });
    });

    it(`should partially update operations with id=${mockOperations.id} - only description`, () => {
      return operationsController
        .partialUpdateOperation(mockOperations.id, { description })
        .then((operations) => {
          expect(operations).not.toBeNull();
          expect(operations).not.toBeUndefined();
          expect(operations.operation_type_id).toBe(mockOperations.operation_type_id);
          expect(operations.account_id).toBe(mockOperations.account_id);
          expect(operations.ni_type_id).toBe(mockOperations.ni_type_id);
          expect(operations.description).toBe(description);
          expect(operations.date).toBe(mockOperations.date);
          expect(operations.id).toBe(mockOperations.id);
        });
    });

    it(`should partially update operations with id=${mockOperations.id} - only date`, () => {
      return operationsController
        .partialUpdateOperation(mockOperations.id, { date })
        .then((operations) => {
          expect(operations).not.toBeNull();
          expect(operations).not.toBeUndefined();
          expect(operations.operation_type_id).toBe(mockOperations.operation_type_id);
          expect(operations.account_id).toBe(mockOperations.account_id);
          expect(operations.ni_type_id).toBe(mockOperations.ni_type_id);
          expect(operations.description).toBe(mockOperations.description);
          expect(operations.date).toBe(date);
          expect(operations.id).toBe(mockOperations.id);
        });
    });
  });

  describe('/operations/:operations_id - DELETE', () => {
    const operationsId = faker.helpers.arrayElement(mockList).id;

    it(`should delete operations with id=${operationsId}`, () => {
      return operationsController.deleteOperation(operationsId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
