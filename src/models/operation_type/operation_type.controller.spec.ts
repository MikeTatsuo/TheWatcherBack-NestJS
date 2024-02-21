import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { operationTypeMock } from '@Mocks/operation_type';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { OperationTypeController } from '@/models/operation_type/operation_type.controller';
import { OperationTypeService } from '@/models/operation_type/operation_type.service';
import { OperationTypeEntity } from '@/models/operation_type/entities/operation_type.entity';

const mockList = MockHelper.generateList(operationTypeMock, ['operation_code', 'operation_type']);
const mockItem = operationTypeMock();
const { countBy, createQueryBuilder, find, findOneBy, save, softDelete } = TestHelper(mockList);
const mockLength = mockList.length;
const paginationData = new PaginationOptionsDTO();
const { page, per_page } = paginationData;

describe('OperationTypeController', () => {
  let operationTypeController: OperationTypeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OperationTypeController],
      providers: [
        OperationTypeService,
        {
          provide: getRepositoryToken(OperationTypeEntity),
          useValue: {
            countBy,
            createQueryBuilder,
            find,
            findOneBy,
            save,
            softDelete,
          },
        },
      ],
    }).compile();

    operationTypeController = app.get<OperationTypeController>(OperationTypeController);
  });

  describe('/operation_type - GET', () => {
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of operation_type list', () => {
      return operationTypeController.getAll(paginationData).then((operationTypeList) => {
        expect(operationTypeList).not.toBeNull();
        expect(operationTypeList).not.toBeUndefined();
        expect(operationTypeList.data).not.toBeNull();
        expect(operationTypeList.data).not.toBeUndefined();
        expect(operationTypeList.page).toBe(page);
        expect(operationTypeList.perPage).toBe(per_page);
        expect(operationTypeList.total).toBe(mockLength);
        expect(operationTypeList.pageCount).toBe(pageCount);
        if (page > 1) expect(operationTypeList.hasPreviousPage).toBeTruthy();
        else expect(operationTypeList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(operationTypeList.hasNextPage).toBeTruthy();
        else expect(operationTypeList.hasNextPage).toBeFalsy();
        expect(operationTypeList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/operation_type/by_id/:operation_type_id - GET', () => {
    const { id, in_operation_type_id, in_registry_id, operation_code, operation_type } =
      faker.helpers.arrayElement(mockList);

    it(`should return operation_type with id=${id}`, () => {
      return operationTypeController.getById(id).then((operationType) => {
        expect(operationType).not.toBeNull();
        expect(operationType).not.toBeUndefined();
        expect(operationType.operation_code).toBe(operation_code);
        expect(operationType.operation_type).toBe(operation_type);
        expect(operationType.in_operation_type_id).toBe(in_operation_type_id);
        expect(operationType.in_registry_id).toBe(in_registry_id);
        expect(operationType.id).toBe(id);
      });
    });
  });

  describe('/operation_type/by_code/:operation_type_code - GET', () => {
    const { id, in_operation_type_id, in_registry_id, operation_code, operation_type } =
      faker.helpers.arrayElement(mockList);

    it(`should return operation_type with code=${operation_code}`, () => {
      return operationTypeController.getByCode(operation_code).then((operationType) => {
        expect(operationType).not.toBeNull();
        expect(operationType).not.toBeUndefined();
        expect(operationType.operation_code).toBe(operation_code);
        expect(operationType.operation_type).toBe(operation_type);
        expect(operationType.in_operation_type_id).toBe(in_operation_type_id);
        expect(operationType.in_registry_id).toBe(in_registry_id);
        expect(operationType.id).toBe(id);
      });
    });
  });

  describe('/operation_type/by_in_code/:in_operation_type_id - GET', () => {
    const { in_operation_type_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter(
      (item) => item.in_operation_type_id === in_operation_type_id,
    ).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of operation_types with in_operation_type_id=${in_operation_type_id}`, () => {
      return operationTypeController
        .getByINCode(in_operation_type_id, paginationData)
        .then((operationType) => {
          expect(operationType).not.toBeNull();
          expect(operationType).not.toBeUndefined();
          expect(operationType.data).not.toBeNull();
          expect(operationType.data).not.toBeUndefined();
          expect(operationType.page).toBe(page);
          expect(operationType.perPage).toBe(per_page);
          expect(operationType.total).toBe(sampleLength);
          expect(operationType.pageCount).toBe(pageCount);
          if (page > 1) expect(operationType.hasPreviousPage).toBeTruthy();
          else expect(operationType.hasPreviousPage).toBeFalsy();
          if (pageCount > 1 && pageCount !== page) expect(operationType.hasNextPage).toBeTruthy();
          else expect(operationType.hasNextPage).toBeFalsy();
          expect(operationType.data.length).toBe(dataLength);
        });
    });
  });

  describe('/operation_type/by_in_registry/:in_registry - GET', () => {
    const { in_registry_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.in_registry_id === in_registry_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of operation_types with in_registry_id=${in_registry_id}`, () => {
      return operationTypeController
        .getByINRegistry(in_registry_id, paginationData)
        .then((operationType) => {
          expect(operationType).not.toBeNull();
          expect(operationType).not.toBeUndefined();
          expect(operationType.data).not.toBeNull();
          expect(operationType.data).not.toBeUndefined();
          expect(operationType.page).toBe(page);
          expect(operationType.perPage).toBe(per_page);
          expect(operationType.total).toBe(sampleLength);
          expect(operationType.pageCount).toBe(pageCount);
          if (page > 1) expect(operationType.hasPreviousPage).toBeTruthy();
          else expect(operationType.hasPreviousPage).toBeFalsy();
          if (pageCount > 1 && pageCount !== page) expect(operationType.hasNextPage).toBeTruthy();
          else expect(operationType.hasNextPage).toBeFalsy();
          expect(operationType.data.length).toBe(dataLength);
        });
    });
  });

  describe('/operation_type - POST', () => {
    it('should create operation_type', () => {
      return operationTypeController.createOperationType(mockItem).then((operationType) => {
        expect(operationType).not.toBeNull();
        expect(operationType).not.toBeUndefined();
        expect(operationType.operation_type).toBe(mockItem.operation_type);
        expect(operationType.operation_code).toBe(mockItem.operation_code);
        expect(operationType.in_operation_type_id).toBe(mockItem.in_operation_type_id);
        expect(operationType.in_registry_id).toBe(mockItem.in_registry_id);
        expect(operationType.id).toBe(mockLength);
      });
    });
  });

  describe('/operation_type/:operation_type_id - PUT', () => {
    const { id } = faker.helpers.arrayElement(mockList);
    it(`should update operation_type with id=${id}`, () => {
      return operationTypeController.updateOperationType(id, mockItem).then((operationType) => {
        expect(operationType).not.toBeNull();
        expect(operationType).not.toBeUndefined();
        expect(operationType.operation_type).toBe(mockItem.operation_type);
        expect(operationType.operation_code).toBe(mockItem.operation_code);
        expect(operationType.in_operation_type_id).toBe(mockItem.in_operation_type_id);
        expect(operationType.in_registry_id).toBe(mockItem.in_registry_id);
        expect(operationType.id).toBe(id);
      });
    });
  });

  describe('/operation_type/:operation_type_id - PATCH', () => {
    const mockOperationType = faker.helpers.arrayElement(mockList);
    const { in_operation_type_id, in_registry_id, operation_code, operation_type } = mockItem;

    it(`should partially update operation_type with id=${mockOperationType.id} - only operation_code`, () => {
      return operationTypeController
        .partialUpdateOperationType(mockOperationType.id, { operation_code })
        .then((operationType) => {
          expect(operationType).not.toBeNull();
          expect(operationType).not.toBeUndefined();
          expect(operationType.operation_type).toBe(mockOperationType.operation_type);
          expect(operationType.operation_code).toBe(operation_code);
          expect(operationType.in_operation_type_id).toBe(mockOperationType.in_operation_type_id);
          expect(operationType.in_registry_id).toBe(mockOperationType.in_registry_id);
          expect(operationType.id).toBe(mockOperationType.id);
        });
    });

    it(`should partially update operation_type with id=${mockOperationType.id} - only operation_type`, () => {
      return operationTypeController
        .partialUpdateOperationType(mockOperationType.id, { operation_type })
        .then((operationType) => {
          expect(operationType).not.toBeNull();
          expect(operationType).not.toBeUndefined();
          expect(operationType.operation_type).toBe(operation_type);
          expect(operationType.operation_code).toBe(mockOperationType.operation_code);
          expect(operationType.in_operation_type_id).toBe(mockOperationType.in_operation_type_id);
          expect(operationType.in_registry_id).toBe(mockOperationType.in_registry_id);
          expect(operationType.id).toBe(mockOperationType.id);
        });
    });

    it(`should partially update operation_type with id=${mockOperationType.id} - only in_operation_type_id`, () => {
      return operationTypeController
        .partialUpdateOperationType(mockOperationType.id, { in_operation_type_id })
        .then((operationType) => {
          expect(operationType).not.toBeNull();
          expect(operationType).not.toBeUndefined();
          expect(operationType.operation_type).toBe(mockOperationType.operation_type);
          expect(operationType.operation_code).toBe(mockOperationType.operation_code);
          expect(operationType.in_operation_type_id).toBe(in_operation_type_id);
          expect(operationType.in_registry_id).toBe(mockOperationType.in_registry_id);
          expect(operationType.id).toBe(mockOperationType.id);
        });
    });

    it(`should partially update operation_type with id=${mockOperationType.id} - only in_resgitry_id`, () => {
      return operationTypeController
        .partialUpdateOperationType(mockOperationType.id, { in_registry_id })
        .then((operationType) => {
          expect(operationType).not.toBeNull();
          expect(operationType).not.toBeUndefined();
          expect(operationType.operation_type).toBe(mockOperationType.operation_type);
          expect(operationType.operation_code).toBe(mockOperationType.operation_code);
          expect(operationType.in_operation_type_id).toBe(mockOperationType.in_operation_type_id);
          expect(operationType.in_registry_id).toBe(in_registry_id);
          expect(operationType.id).toBe(mockOperationType.id);
        });
    });
  });

  describe('/operation_type/:operation_type_id - DELETE', () => {
    const operationTypeId = faker.helpers.arrayElement(mockList).id;

    it(`should delete operation_type with id=${operationTypeId}`, () => {
      return operationTypeController.deleteOperationType(operationTypeId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
