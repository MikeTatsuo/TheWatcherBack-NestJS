import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { taxTypeMock } from '@Mocks/tax_type';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { TaxTypeController } from '@/models/tax_type/tax_type.controller';
import { TaxTypeService } from '@/models/tax_type/tax_type.service';
import { TaxTypeEntity } from '@/models/tax_type/entities/tax_type.entity';

const mockList = MockHelper.generateList(taxTypeMock, ['tax_type']);
const mockItem = taxTypeMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;

describe('TaxTypeController', () => {
  let taxTypeController: TaxTypeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaxTypeController],
      providers: [
        TaxTypeService,
        {
          provide: getRepositoryToken(TaxTypeEntity),
          useValue,
        },
      ],
    }).compile();

    taxTypeController = app.get<TaxTypeController>(TaxTypeController);
  });

  describe('/tax_type - GET', () => {
    const paginationData = new PaginationOptionsDTO();
    const { page, per_page } = paginationData;
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of tax_type list', () => {
      return taxTypeController.getAll(paginationData).then((taxTypeList) => {
        expect(taxTypeList).not.toBeNull();
        expect(taxTypeList).not.toBeUndefined();
        expect(taxTypeList.data).not.toBeNull();
        expect(taxTypeList.data).not.toBeUndefined();
        expect(taxTypeList.page).toBe(page);
        expect(taxTypeList.perPage).toBe(per_page);
        expect(taxTypeList.total).toBe(mockLength);
        expect(taxTypeList.pageCount).toBe(pageCount);
        if (page > 1) expect(taxTypeList.hasPreviousPage).toBeTruthy();
        else expect(taxTypeList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(taxTypeList.hasNextPage).toBeTruthy();
        else expect(taxTypeList.hasNextPage).toBeFalsy();
        expect(taxTypeList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/tax_type/by_id/:tax_type_id - GET', () => {
    const { id, tax_type } = faker.helpers.arrayElement(mockList);

    it(`should return tax_type with id=${id}`, () => {
      return taxTypeController.getById(id).then((taxType) => {
        expect(taxType).not.toBeNull();
        expect(taxType).not.toBeUndefined();
        expect(taxType.tax_type).toBe(tax_type);
        expect(taxType.id).toBe(id);
      });
    });
  });

  describe('/tax_type - POST', () => {
    it('should create tax_type', () => {
      return taxTypeController.createTaxType(mockItem).then((taxType) => {
        expect(taxType).not.toBeNull();
        expect(taxType).not.toBeUndefined();
        expect(taxType.tax_type).toBe(mockItem.tax_type);
        expect(taxType.id).toBe(mockLength);
      });
    });
  });

  describe('/tax_type/:tax_type_id - PUT', () => {
    const { id } = faker.helpers.arrayElement(mockList);

    it(`should update tax_type with id=${id}`, () => {
      return taxTypeController.updateTaxType(id, mockItem).then((taxType) => {
        expect(taxType).not.toBeNull();
        expect(taxType).not.toBeUndefined();
        expect(taxType.tax_type).toBe(mockItem.tax_type);
        expect(taxType.id).toBe(id);
      });
    });
  });

  describe('/tax_type/:tax_type_id - PATCH', () => {
    const mockTaxType = faker.helpers.arrayElement(mockList);
    const { tax_type } = mockItem;

    it(`should partially update tax_type with id=${mockTaxType.id} - only in_operation`, () => {
      return taxTypeController
        .partialUpdateTaxType(mockTaxType.id, { tax_type })
        .then((taxType) => {
          expect(taxType).not.toBeNull();
          expect(taxType).not.toBeUndefined();
          expect(taxType.tax_type).toBe(tax_type);
          expect(taxType.id).toBe(mockTaxType.id);
        });
    });
  });

  describe('/tax_type/:tax_type_id - DELETE', () => {
    const taxTypeId = faker.helpers.arrayElement(mockList).id;

    it(`should delete tax_type with id=${taxTypeId}`, () => {
      return taxTypeController.deleteTaxType(taxTypeId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
