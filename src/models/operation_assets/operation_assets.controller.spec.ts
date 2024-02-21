import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { operationAssetsMock } from '@Mocks/operation_assets';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { AssetsService } from '@/models/assets/assets.service';
import { ValuesService } from '@/models/values/values.service';
import { AssetsEntity } from '@/models/assets/entities/assets.entity';
import { ValuesEntity } from '@/models/values/entities/values.entity';

import { OperationAssetsController } from '@/models/operation_assets/operation_assets.controller';
import { OperationAssetsService } from '@/models/operation_assets/operation_assets.service';
import { OperationAssetsEntity } from '@/models/operation_assets/entities/operation_assets.entity';

const mockList = MockHelper.generateList(operationAssetsMock);
const mockItem = operationAssetsMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;
const paginationData = new PaginationOptionsDTO();
const { page, per_page } = paginationData;

describe('OperationAssetsController', () => {
  let operationAssetsController: OperationAssetsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OperationAssetsController],
      providers: [
        OperationAssetsService,
        AssetsService,
        ValuesService,
        {
          provide: getRepositoryToken(OperationAssetsEntity),
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

    operationAssetsController = app.get<OperationAssetsController>(OperationAssetsController);
  });

  describe('/operation_assets - GET', () => {
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of operation assets list', () => {
      return operationAssetsController.getAll(paginationData).then((operationAssetsList) => {
        expect(operationAssetsList).not.toBeNull();
        expect(operationAssetsList).not.toBeUndefined();
        expect(operationAssetsList.data).not.toBeNull();
        expect(operationAssetsList.data).not.toBeUndefined();
        expect(operationAssetsList.page).toBe(page);
        expect(operationAssetsList.perPage).toBe(per_page);
        expect(operationAssetsList.total).toBe(mockLength);
        expect(operationAssetsList.pageCount).toBe(pageCount);
        if (page > 1) expect(operationAssetsList.hasPreviousPage).toBeTruthy();
        else expect(operationAssetsList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page)
          expect(operationAssetsList.hasNextPage).toBeTruthy();
        else expect(operationAssetsList.hasNextPage).toBeFalsy();
        expect(operationAssetsList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/operation_assets/by_id/:operation_asset_id - GET', () => {
    const { id, operation_id, value_id } = faker.helpers.arrayElement(mockList);

    it(`should return operation asset with id=${id}`, () => {
      return operationAssetsController.getById(id).then((operationAsset) => {
        expect(operationAsset).not.toBeNull();
        expect(operationAsset).not.toBeUndefined();
        expect(operationAsset.operation_id).toBe(operation_id);
        expect(operationAsset.value_id).toBe(value_id);
        expect(operationAsset.id).toBe(id);
      });
    });
  });

  describe('/operation_assets/by_operation_type/:operation_id - GET', () => {
    const { operation_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.operation_id === operation_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return operation assets with operation_id=${operation_id}`, () => {
      return operationAssetsController
        .getByOperation(operation_id, paginationData)
        .then((operationAssetsList) => {
          expect(operationAssetsList).not.toBeNull();
          expect(operationAssetsList).not.toBeUndefined();
          expect(operationAssetsList.data).not.toBeNull();
          expect(operationAssetsList.data).not.toBeUndefined();
          expect(operationAssetsList.page).toBe(page);
          expect(operationAssetsList.perPage).toBe(per_page);
          expect(operationAssetsList.total).toBe(sampleLength);
          expect(operationAssetsList.pageCount).toBe(pageCount);
          if (page > 1) expect(operationAssetsList.hasPreviousPage).toBeTruthy();
          else expect(operationAssetsList.hasPreviousPage).toBeFalsy();
          if (pageCount > 1 && pageCount !== page)
            expect(operationAssetsList.hasNextPage).toBeTruthy();
          else expect(operationAssetsList.hasNextPage).toBeFalsy();
          expect(operationAssetsList.data.length).toBe(dataLength);
        });
    });
  });

  describe('/operation_assets - POST', () => {
    it('should create an operation asset', () => {
      return operationAssetsController.createOperation(mockItem).then((operationAsset) => {
        expect(operationAsset).not.toBeNull();
        expect(operationAsset).not.toBeUndefined();
        expect(operationAsset.operation_id).toBe(mockItem.operation_id);
        expect(operationAsset.value_id).toBe(mockItem.value_id);
        expect(operationAsset.id).toBe(mockLength);
      });
    });
  });

  describe('/operation_assets/:operation_asset_id - PUT', () => {
    const { id } = faker.helpers.arrayElement(mockList);

    it(`should update an operation asset with id=${id}`, () => {
      return operationAssetsController.updateOperation(id, mockItem).then((operationAsset) => {
        expect(operationAsset).not.toBeNull();
        expect(operationAsset).not.toBeUndefined();
        expect(operationAsset.operation_id).toBe(mockItem.operation_id);
        expect(operationAsset.value_id).toBe(mockItem.value_id);
        expect(operationAsset.id).toBe(id);
      });
    });
  });

  describe('/operation_assets/:operation_asset_id - PATCH', () => {
    const mockOperationAsset = faker.helpers.arrayElement(mockList);
    const { operation_id, value_id } = mockItem;

    it(`should partially update an operation asset with id=${mockOperationAsset.id} - only operation_id`, () => {
      return operationAssetsController
        .partialUpdateOperation(mockOperationAsset.id, { operation_id })
        .then((operationAsset) => {
          expect(operationAsset).not.toBeNull();
          expect(operationAsset).not.toBeUndefined();
          expect(operationAsset.operation_id).toBe(operation_id);
          expect(operationAsset.value_id).toBe(mockOperationAsset.value_id);
          expect(operationAsset.id).toBe(mockOperationAsset.id);
        });
    });

    it(`should partially update an operation asset with id=${mockOperationAsset.id} - only value_id`, () => {
      return operationAssetsController
        .partialUpdateOperation(mockOperationAsset.id, { value_id })
        .then((operationAsset) => {
          expect(operationAsset).not.toBeNull();
          expect(operationAsset).not.toBeUndefined();
          expect(operationAsset.operation_id).toBe(mockOperationAsset.operation_id);
          expect(operationAsset.value_id).toBe(value_id);
          expect(operationAsset.id).toBe(mockOperationAsset.id);
        });
    });
  });

  describe('/operation_assets/:operation_asset_id - DELETE', () => {
    const operationAssetId = faker.helpers.arrayElement(mockList).id;

    it(`should delete an operation asset with id=${operationAssetId}`, () => {
      return operationAssetsController.deleteOperation(operationAssetId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
