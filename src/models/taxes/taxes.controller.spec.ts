import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { createTaxesMock, taxesMock } from '@Mocks/taxes';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { TaxesController } from '@/models/taxes/taxes.controller';
import { TaxesService } from '@/models/taxes/taxes.service';
import { TaxesEntity } from '@/models/taxes/entities/taxes.entity';
import { ValuesService } from '../values/values.service';
import { ValuesEntity } from '../values/entities/values.entity';
import { AssetsService } from '../assets/assets.service';
import { AssetsEntity } from '../assets/entities/assets.entity';

const mockList = MockHelper.generateList(taxesMock);
const createMockItem = createTaxesMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;
const paginationData = new PaginationOptionsDTO();
const { page, per_page } = paginationData;

describe('TaxesController', () => {
  let taxesController: TaxesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaxesController],
      providers: [
        AssetsService,
        TaxesService,
        ValuesService,
        {
          provide: getRepositoryToken(AssetsEntity),
          useValue,
        },
        {
          provide: getRepositoryToken(TaxesEntity),
          useValue,
        },
        {
          provide: getRepositoryToken(ValuesEntity),
          useValue,
        },
      ],
    }).compile();

    taxesController = app.get<TaxesController>(TaxesController);
  });

  describe('/taxes - GET', () => {
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of taxes list', () => {
      return taxesController.getAll(paginationData).then((taxesList) => {
        expect(taxesList).not.toBeNull();
        expect(taxesList).not.toBeUndefined();
        expect(taxesList.data).not.toBeNull();
        expect(taxesList.data).not.toBeUndefined();
        expect(taxesList.page).toBe(page);
        expect(taxesList.perPage).toBe(per_page);
        expect(taxesList.total).toBe(mockLength);
        expect(taxesList.pageCount).toBe(pageCount);
        if (page > 1) expect(taxesList.hasPreviousPage).toBeTruthy();
        else expect(taxesList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(taxesList.hasNextPage).toBeTruthy();
        else expect(taxesList.hasNextPage).toBeFalsy();
        expect(taxesList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/taxes/by_id/:tax_id - GET', () => {
    const { id, tax_type_id, value_id, operation_id } = faker.helpers.arrayElement(mockList);

    it(`should return taxes with id=${id}`, () => {
      return taxesController.getById(id).then((taxes) => {
        expect(taxes).not.toBeNull();
        expect(taxes).not.toBeUndefined();
        expect(taxes.tax_type_id).toBe(tax_type_id);
        expect(taxes.value_id).toBe(value_id);
        expect(taxes.operation_id).toBe(operation_id);
        expect(taxes.id).toBe(id);
      });
    });
  });

  describe('/taxes/by_tax_type/:tax_type_id - GET', () => {
    const { tax_type_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.tax_type_id === tax_type_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of taxess with tax_type_id=${tax_type_id}`, () => {
      return taxesController.getByTaxType(tax_type_id, paginationData).then((taxes) => {
        expect(taxes).not.toBeNull();
        expect(taxes).not.toBeUndefined();
        expect(taxes.data).not.toBeNull();
        expect(taxes.data).not.toBeUndefined();
        expect(taxes.page).toBe(page);
        expect(taxes.perPage).toBe(per_page);
        expect(taxes.total).toBe(sampleLength);
        expect(taxes.pageCount).toBe(pageCount);
        if (page > 1) expect(taxes.hasPreviousPage).toBeTruthy();
        else expect(taxes.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(taxes.hasNextPage).toBeTruthy();
        else expect(taxes.hasNextPage).toBeFalsy();
        expect(taxes.data.length).toBe(dataLength);
      });
    });
  });

  describe('/taxes/by_operation/:operation_id - GET', () => {
    const { operation_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.operation_id === operation_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of taxess with operation_id=${operation_id}`, () => {
      return taxesController.getByOperation(operation_id, paginationData).then((taxes) => {
        expect(taxes).not.toBeNull();
        expect(taxes).not.toBeUndefined();
        expect(taxes.data).not.toBeNull();
        expect(taxes.data).not.toBeUndefined();
        expect(taxes.page).toBe(page);
        expect(taxes.perPage).toBe(per_page);
        expect(taxes.total).toBe(sampleLength);
        expect(taxes.pageCount).toBe(pageCount);
        if (page > 1) expect(taxes.hasPreviousPage).toBeTruthy();
        else expect(taxes.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(taxes.hasNextPage).toBeTruthy();
        else expect(taxes.hasNextPage).toBeFalsy();
        expect(taxes.data.length).toBe(dataLength);
      });
    });
  });

  describe('/taxes - POST', () => {
    it('should create taxes', () => {
      return taxesController.createTaxes(createMockItem).then((taxes) => {
        expect(taxes).not.toBeNull();
        expect(taxes).not.toBeUndefined();
        expect(taxes.tax_type_id).toBe(createMockItem.tax_type_id);
        expect(taxes.operation_id).toBe(createMockItem.operation_id);
        expect(taxes.id).toBe(mockLength);
      });
    });
  });

  describe('/taxes/:taxes_id - PUT', () => {
    const mockItem = faker.helpers.arrayElement(mockList);

    it(`should update taxes with id=${mockItem.id}`, () => {
      return taxesController.updateTaxes(mockItem.id, mockItem).then((taxes) => {
        expect(taxes).not.toBeNull();
        expect(taxes).not.toBeUndefined();
        expect(taxes.tax_type_id).toBe(mockItem.tax_type_id);
        expect(taxes.value_id).toBe(mockItem.value_id);
        expect(taxes.operation_id).toBe(mockItem.operation_id);
        expect(taxes.id).toBe(mockItem.id);
      });
    });
  });

  describe('/taxes/:taxes_id - PATCH', () => {
    const mockTaxes = faker.helpers.arrayElement(mockList);
    const { tax_type_id, operation_id, asset_id, value } = createMockItem;

    it(`should partially update taxes with id=${mockTaxes.id} - only tax_type_id`, () => {
      return taxesController.partialUpdateTaxes(mockTaxes.id, { tax_type_id }).then((taxes) => {
        expect(taxes).not.toBeNull();
        expect(taxes).not.toBeUndefined();
        expect(taxes.tax_type_id).toBe(tax_type_id);
        expect(taxes.value_id).toBe(mockTaxes.value_id);
        expect(taxes.operation_id).toBe(mockTaxes.operation_id);
        expect(taxes.id).toBe(mockTaxes.id);
      });
    });

    it(`should partially update taxes with id=${mockTaxes.id} - only operation_id`, () => {
      return taxesController.partialUpdateTaxes(mockTaxes.id, { operation_id }).then((taxes) => {
        expect(taxes).not.toBeNull();
        expect(taxes).not.toBeUndefined();
        expect(taxes.tax_type_id).toBe(mockTaxes.tax_type_id);
        expect(taxes.value_id).toBe(mockTaxes.value_id);
        expect(taxes.operation_id).toBe(operation_id);
        expect(taxes.id).toBe(mockTaxes.id);
      });
    });

    it(`should partially update taxes with id=${mockTaxes.id} - only value`, () => {
      return taxesController.partialUpdateTaxes(mockTaxes.id, { value }).then((taxes) => {
        expect(taxes).not.toBeNull();
        expect(taxes).not.toBeUndefined();
        expect(taxes.tax_type_id).toBe(mockTaxes.tax_type_id);
        expect(taxes.value_id).toBe(mockTaxes.value_id);
        expect(taxes.operation_id).toBe(mockTaxes.operation_id);
        expect(taxes.id).toBe(mockTaxes.id);
      });
    });

    it(`should partially update taxes with id=${mockTaxes.id} - only asset_id`, () => {
      return taxesController.partialUpdateTaxes(mockTaxes.id, { asset_id }).then((taxes) => {
        expect(taxes).not.toBeNull();
        expect(taxes).not.toBeUndefined();
        expect(taxes.tax_type_id).toBe(mockTaxes.tax_type_id);
        expect(taxes.value_id).toBe(mockTaxes.value_id);
        expect(taxes.operation_id).toBe(mockTaxes.operation_id);
        expect(taxes.id).toBe(mockTaxes.id);
      });
    });
  });

  describe('/taxes/:taxes_id - DELETE', () => {
    const taxesId = faker.helpers.arrayElement(mockList).id;

    it(`should delete taxes with id=${taxesId}`, () => {
      return taxesController.deleteTaxes(taxesId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
