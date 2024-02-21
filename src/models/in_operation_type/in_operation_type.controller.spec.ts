import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { inOperationTypeMock } from '@Mocks/in_operation_type';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { INOperationTypeController } from '@/models/in_operation_type/in_operation_type.controller';
import { INOperationTypeService } from '@/models/in_operation_type/in_operation_type.service';
import { INOperationTypeEntity } from '@/models/in_operation_type/entities/in_operation_type.entity';

const mockList = MockHelper.generateList(inOperationTypeMock, [
  'in_operation',
  'in_operation_code',
]);
const mockItem = inOperationTypeMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;

describe('INOperationTypeController', () => {
  let inOperationTypeController: INOperationTypeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [INOperationTypeController],
      providers: [
        INOperationTypeService,
        {
          provide: getRepositoryToken(INOperationTypeEntity),
          useValue,
        },
      ],
    }).compile();

    inOperationTypeController = app.get<INOperationTypeController>(INOperationTypeController);
  });

  describe('/in_operation_type - GET', () => {
    const paginationData = new PaginationOptionsDTO();
    const { page, per_page } = paginationData;
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of in_operation_type list', () => {
      return inOperationTypeController.getAll(paginationData).then((inOperationTypeList) => {
        expect(inOperationTypeList).not.toBeNull();
        expect(inOperationTypeList).not.toBeUndefined();
        expect(inOperationTypeList.data).not.toBeNull();
        expect(inOperationTypeList.data).not.toBeUndefined();
        expect(inOperationTypeList.page).toBe(page);
        expect(inOperationTypeList.perPage).toBe(per_page);
        expect(inOperationTypeList.total).toBe(mockLength);
        expect(inOperationTypeList.pageCount).toBe(pageCount);
        if (page > 1) expect(inOperationTypeList.hasPreviousPage).toBeTruthy();
        else expect(inOperationTypeList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page)
          expect(inOperationTypeList.hasNextPage).toBeTruthy();
        else expect(inOperationTypeList.hasNextPage).toBeFalsy();
        expect(inOperationTypeList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/in_operation_type/by_id/:in_operation_type_id - GET', () => {
    const { id, in_operation, in_operation_code } = faker.helpers.arrayElement(mockList);

    it(`should return in_operation_type with id=${id}`, () => {
      return inOperationTypeController.getById(id).then((inOperationType) => {
        expect(inOperationType).not.toBeNull();
        expect(inOperationType).not.toBeUndefined();
        expect(inOperationType.in_operation).toBe(in_operation);
        expect(inOperationType.in_operation_code).toBe(in_operation_code);
        expect(inOperationType.id).toBe(id);
      });
    });
  });

  describe('/in_operation_type/by_code/:in_operation_type_code - GET', () => {
    const { id, in_operation, in_operation_code } = faker.helpers.arrayElement(mockList);

    it(`should return in_operation_type with code=${in_operation_code}`, () => {
      return inOperationTypeController.getByCode(in_operation_code).then((inOperationType) => {
        expect(inOperationType).not.toBeNull();
        expect(inOperationType).not.toBeUndefined();
        expect(inOperationType.in_operation).toBe(in_operation);
        expect(inOperationType.in_operation_code).toBe(in_operation_code);
        expect(inOperationType.id).toBe(id);
      });
    });
  });

  describe('/in_operation_type - POST', () => {
    it('should create in_operation_type', () => {
      return inOperationTypeController.createINOperationType(mockItem).then((inOperationType) => {
        expect(inOperationType).not.toBeNull();
        expect(inOperationType).not.toBeUndefined();
        expect(inOperationType.in_operation).toBe(mockItem.in_operation);
        expect(inOperationType.in_operation_code).toBe(mockItem.in_operation_code);
        expect(inOperationType.id).toBe(mockLength);
      });
    });
  });

  describe('/in_operation_type/:in_operation_type_id - PUT', () => {
    const mockINOperationType = faker.helpers.arrayElement(mockList);

    it(`should update in_operation_type with id=${mockINOperationType.id}`, () => {
      return inOperationTypeController
        .updateINOperationType(mockINOperationType.id, mockItem)
        .then((inOperationType) => {
          expect(inOperationType).not.toBeNull();
          expect(inOperationType).not.toBeUndefined();
          expect(inOperationType.in_operation).toBe(mockItem.in_operation);
          expect(inOperationType.in_operation_code).toBe(mockItem.in_operation_code);
          expect(inOperationType.id).toBe(mockINOperationType.id);
        });
    });
  });

  describe('/in_operation_type/:in_operation_type_id - PATCH', () => {
    const mockINOperationType = faker.helpers.arrayElement(mockList);
    const { in_operation, in_operation_code } = mockItem;

    it(`should partially update in_operation_type with id=${mockINOperationType.id} - only in_operation`, () => {
      return inOperationTypeController
        .partialUpdateINOperationType(mockINOperationType.id, { in_operation })
        .then((inOperationType) => {
          expect(inOperationType).not.toBeNull();
          expect(inOperationType).not.toBeUndefined();
          expect(inOperationType.in_operation).toBe(in_operation);
          expect(inOperationType.in_operation_code).toBe(mockINOperationType.in_operation_code);
          expect(inOperationType.id).toBe(mockINOperationType.id);
        });
    });

    it(`should partially update in_operation_type with id=${mockINOperationType.id} - only in_operation_code`, () => {
      return inOperationTypeController
        .partialUpdateINOperationType(mockINOperationType.id, { in_operation_code })
        .then((inOperationType) => {
          expect(inOperationType).not.toBeNull();
          expect(inOperationType).not.toBeUndefined();
          expect(inOperationType.in_operation).toBe(mockINOperationType.in_operation);
          expect(inOperationType.in_operation_code).toBe(in_operation_code);
          expect(inOperationType.id).toBe(mockINOperationType.id);
        });
    });
  });

  describe('/in_operation_type/:in_operation_type_id - DELETE', () => {
    const inOperationTypeId = faker.helpers.arrayElement(mockList).id;

    it(`should delete in_operation_type with id=${inOperationTypeId}`, () => {
      return inOperationTypeController.deleteINOperationType(inOperationTypeId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
