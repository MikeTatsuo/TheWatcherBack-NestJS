import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { valuesMock } from '@Mocks/values';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { ValuesController } from '@/models/values/values.controller';
import { ValuesService } from '@/models/values/values.service';
import { ValuesEntity } from '@/models/values/entities/values.entity';
import { AssetsService } from '@/models/assets/assets.service';
import { AssetsEntity } from '@/models/assets/entities/assets.entity';

const mockList = MockHelper.generateList(valuesMock);
const mockItem = valuesMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;
const paginationData = new PaginationOptionsDTO();
const { page, per_page } = paginationData;

describe('ValuesController', () => {
  let valuesController: ValuesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ValuesController],
      providers: [
        ValuesService,
        AssetsService,
        {
          provide: getRepositoryToken(ValuesEntity),
          useValue,
        },
        {
          provide: getRepositoryToken(AssetsEntity),
          useValue,
        },
      ],
    }).compile();

    valuesController = app.get<ValuesController>(ValuesController);
  });

  describe('/values - GET', () => {
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of values list', () => {
      return valuesController.getAll(paginationData).then((valuesList) => {
        expect(valuesList).not.toBeNull();
        expect(valuesList).not.toBeUndefined();
        expect(valuesList.data).not.toBeNull();
        expect(valuesList.data).not.toBeUndefined();
        expect(valuesList.page).toBe(page);
        expect(valuesList.perPage).toBe(per_page);
        expect(valuesList.total).toBe(mockLength);
        expect(valuesList.pageCount).toBe(pageCount);
        if (page > 1) expect(valuesList.hasPreviousPage).toBeTruthy();
        else expect(valuesList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(valuesList.hasNextPage).toBeTruthy();
        else expect(valuesList.hasNextPage).toBeFalsy();
        expect(valuesList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/values/by_id/:values_id - GET', () => {
    const { id, value, asset_id } = faker.helpers.arrayElement(mockList);

    it(`should return values with id=${id}`, () => {
      return valuesController.getById(id).then((values) => {
        expect(values).not.toBeNull();
        expect(values).not.toBeUndefined();
        expect(values.value).toBe(value);
        expect(values.asset_id).toBe(asset_id);
        expect(values.id).toBe(id);
      });
    });
  });

  describe('/values/by_asset/:asset_id - GET', () => {
    const { asset_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.asset_id === asset_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of value list with asset_id=${asset_id}`, () => {
      return valuesController.getByAsset(asset_id, paginationData).then((valuesList) => {
        expect(valuesList).not.toBeNull();
        expect(valuesList).not.toBeUndefined();
        expect(valuesList.data).not.toBeNull();
        expect(valuesList.data).not.toBeUndefined();
        expect(valuesList.page).toBe(page);
        expect(valuesList.perPage).toBe(per_page);
        expect(valuesList.total).toBe(sampleLength);
        expect(valuesList.pageCount).toBe(pageCount);
        if (page > 1) expect(valuesList.hasPreviousPage).toBeTruthy();
        else expect(valuesList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(valuesList.hasNextPage).toBeTruthy();
        else expect(valuesList.hasNextPage).toBeFalsy();
        expect(valuesList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/values - POST', () => {
    it('should create values', () => {
      return valuesController.createValue(mockItem).then((values) => {
        expect(values).not.toBeNull();
        expect(values).not.toBeUndefined();
        expect(values.value).toBe(mockItem.value);
        expect(values.asset_id).toBe(mockItem.asset_id);
        expect(values.id).toBe(mockLength);
      });
    });
  });

  describe('/user/:user_id - PUT', () => {
    const valueId = faker.helpers.arrayElement(mockList).id;

    it(`should update user with id=${valueId}`, () => {
      return valuesController.updateValue(valueId, mockItem).then((values) => {
        expect(values).not.toBeNull();
        expect(values).not.toBeUndefined();
        expect(values.value).toBe(mockItem.value);
        expect(values.asset_id).toBe(mockItem.asset_id);
        expect(values.id).toBe(valueId);
      });
    });
  });

  describe('/values/:values_id - PATCH', () => {
    const mockValues = faker.helpers.arrayElement(mockList);
    const { value, asset_id } = mockItem;

    it(`should partially update value with id=${mockValues.id} - only value`, () => {
      return valuesController.partialUpdateValue(mockValues.id, { value }).then((values) => {
        expect(values).not.toBeNull();
        expect(values).not.toBeUndefined();
        expect(values.value).toBe(value);
        expect(values.asset_id).toBe(mockValues.asset_id);
        expect(values.id).toBe(mockValues.id);
      });
    });

    it(`should partially update values with id=${mockValues.id} - only asset_id`, () => {
      return valuesController.partialUpdateValue(mockValues.id, { asset_id }).then((values) => {
        expect(values).not.toBeNull();
        expect(values).not.toBeUndefined();
        expect(values.value).toBe(mockValues.value);
        expect(values.asset_id).toBe(asset_id);
        expect(values.id).toBe(mockValues.id);
      });
    });
  });

  describe('/values/:values_id - DELETE', () => {
    const valueId = faker.helpers.arrayElement(mockList).id;

    it(`should delete values with id=${valueId}`, () => {
      return valuesController.deleteValue(valueId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
