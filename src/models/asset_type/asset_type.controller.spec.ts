import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { assetTypeMock } from '@Mocks/asset_type';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { AssetTypeController } from '@/models/asset_type/asset_type.controller';
import { AssetTypeService } from '@/models/asset_type/asset_type.service';
import { AssetTypeEntity } from '@/models/asset_type/entities/asset_type.entity';

const mockList = MockHelper.generateList(assetTypeMock);
const mockItem = assetTypeMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;

describe('AssetTypeController', () => {
  let assetTypeController: AssetTypeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AssetTypeController],
      providers: [
        AssetTypeService,
        {
          provide: getRepositoryToken(AssetTypeEntity),
          useValue,
        },
      ],
    }).compile();

    assetTypeController = app.get<AssetTypeController>(AssetTypeController);
  });

  describe('/asset_type - GET', () => {
    const paginationData = new PaginationOptionsDTO();
    const { page, per_page } = paginationData;
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of asset_type list', () => {
      return assetTypeController.getAll(paginationData).then((assetTypeList) => {
        expect(assetTypeList).not.toBeNull();
        expect(assetTypeList).not.toBeUndefined();
        expect(assetTypeList.data).not.toBeNull();
        expect(assetTypeList.data).not.toBeUndefined();
        expect(assetTypeList.page).toBe(page);
        expect(assetTypeList.perPage).toBe(per_page);
        expect(assetTypeList.total).toBe(mockLength);
        expect(assetTypeList.pageCount).toBe(pageCount);
        if (page > 1) expect(assetTypeList.hasPreviousPage).toBeTruthy();
        else expect(assetTypeList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(assetTypeList.hasNextPage).toBeTruthy();
        else expect(assetTypeList.hasNextPage).toBeFalsy();
        expect(assetTypeList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/asset_type/by_id/:asset_type_id - GET', () => {
    const assetTypeId = faker.helpers.arrayElement(mockList).id;
    const { asset_type, id } = mockList.find((item) => item.id === assetTypeId);

    it(`should return asset_type with id=${assetTypeId}`, () => {
      return assetTypeController.getById(assetTypeId).then((assetType) => {
        expect(assetType).not.toBeNull();
        expect(assetType).not.toBeUndefined();
        expect(assetType.asset_type).toBe(asset_type);
        expect(assetType.id).toBe(id);
      });
    });
  });

  describe('/asset_type - POST', () => {
    it('should create asset_type', () => {
      return assetTypeController.createAssetType(mockItem).then((assetType) => {
        expect(assetType).not.toBeNull();
        expect(assetType).not.toBeUndefined();
        expect(assetType.asset_type).toBe(mockItem.asset_type);
        expect(assetType.id).toBe(mockLength);
      });
    });
  });

  describe('/asset_type/:asset_type_id - PUT', () => {
    const assetTypeId = faker.helpers.arrayElement(mockList).id;

    it(`should update asset_type with id=${assetTypeId}`, () => {
      return assetTypeController.updateAssetType(assetTypeId, mockItem).then((assetType) => {
        expect(assetType).not.toBeNull();
        expect(assetType).not.toBeUndefined();
        expect(assetType.asset_type).toBe(mockItem.asset_type);
        expect(assetType.id).toBe(assetTypeId);
      });
    });
  });

  describe('/asset_type/:asset_type_id - PATCH', () => {
    const assetTypeId = faker.helpers.arrayElement(mockList).id;
    const { asset_type } = mockItem;

    it(`should partially update asset_type with id=${assetTypeId} - only asset_type`, () => {
      return assetTypeController
        .partialUpdateAssetType(assetTypeId, { asset_type })
        .then((assetType) => {
          expect(assetType).not.toBeNull();
          expect(assetType).not.toBeUndefined();
          expect(assetType.asset_type).toBe(mockItem.asset_type);
          expect(assetType.id).toBe(assetTypeId);
        });
    });
  });

  describe('/asset_type/:asset_type_id - DELETE', () => {
    const assetTypeId = faker.helpers.arrayElement(mockList).id;

    it(`should delete asset_type with id=${assetTypeId}`, () => {
      return assetTypeController.deleteAssetType(assetTypeId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
