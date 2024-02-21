import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { assetsMock } from '@Mocks/assets';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { AssetsController } from '@/models/assets/assets.controller';
import { AssetsService } from '@/models/assets/assets.service';
import { AssetsEntity } from '@/models/assets/entities/assets.entity';

const mockList = MockHelper.generateList(assetsMock, ['ticker']);
const mockItem = assetsMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;
const paginationData = new PaginationOptionsDTO();
const { page, per_page } = paginationData;

describe('AssetsController', () => {
  let assetsController: AssetsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AssetsController],
      providers: [
        AssetsService,
        {
          provide: getRepositoryToken(AssetsEntity),
          useValue,
        },
      ],
    }).compile();

    assetsController = app.get<AssetsController>(AssetsController);
  });

  describe('/assets - GET', () => {
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of assets list', () => {
      return assetsController.getAll(paginationData).then((assetsList) => {
        expect(assetsList).not.toBeNull();
        expect(assetsList).not.toBeUndefined();
        expect(assetsList.data).not.toBeNull();
        expect(assetsList.data).not.toBeUndefined();
        expect(assetsList.page).toBe(page);
        expect(assetsList.perPage).toBe(per_page);
        expect(assetsList.total).toBe(mockLength);
        expect(assetsList.pageCount).toBe(pageCount);
        if (page > 1) expect(assetsList.hasPreviousPage).toBeTruthy();
        else expect(assetsList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(assetsList.hasNextPage).toBeTruthy();
        else expect(assetsList.hasNextPage).toBeFalsy();
        expect(assetsList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/assets/by_id/:assets_id - GET', () => {
    const { asset, id, ticker, asset_type_id } = faker.helpers.arrayElement(mockList);

    it(`should return assets with id=${id}`, () => {
      return assetsController.getById(id).then((assets) => {
        expect(assets).not.toBeNull();
        expect(assets).not.toBeUndefined();
        expect(assets.asset).toBe(asset);
        expect(assets.ticker).toBe(ticker);
        expect(assets.asset_type_id).toBe(asset_type_id);
        expect(assets.id).toBe(id);
      });
    });
  });

  describe('/assets/by_ticker/:ticker - GET', () => {
    const { asset, id, ticker, asset_type_id } = faker.helpers.arrayElement(mockList);

    it(`should return assets with ticker=${ticker}`, () => {
      return assetsController.getByTicker(ticker).then((assets) => {
        expect(assets).not.toBeNull();
        expect(assets).not.toBeUndefined();
        expect(assets.asset).toBe(asset);
        expect(assets.ticker).toBe(ticker);
        expect(assets.asset_type_id).toBe(asset_type_id);
        expect(assets.id).toBe(id);
      });
    });
  });

  describe('/assets/by_asset_type/:asset_type_id - GET', () => {
    const { asset_type_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.asset_type_id === asset_type_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of assets list with asset_type_id=${asset_type_id}`, () => {
      return assetsController.getByAssetType(asset_type_id, paginationData).then((assetsList) => {
        expect(assetsList).not.toBeNull();
        expect(assetsList).not.toBeUndefined();
        expect(assetsList.data).not.toBeNull();
        expect(assetsList.data).not.toBeUndefined();
        expect(assetsList.page).toBe(page);
        expect(assetsList.perPage).toBe(per_page);
        expect(assetsList.total).toBe(sampleLength);
        expect(assetsList.pageCount).toBe(pageCount);
        if (page > 1) expect(assetsList.hasPreviousPage).toBeTruthy();
        else expect(assetsList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(assetsList.hasNextPage).toBeTruthy();
        else expect(assetsList.hasNextPage).toBeFalsy();
        expect(assetsList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/assets - POST', () => {
    it('should create assets', () => {
      return assetsController.createAssets(mockItem).then((assets) => {
        expect(assets).not.toBeNull();
        expect(assets).not.toBeUndefined();
        expect(assets.asset).toBe(mockItem.asset);
        expect(assets.ticker).toBe(mockItem.ticker);
        expect(assets.asset_type_id).toBe(mockItem.asset_type_id);
        expect(assets.id).toBe(mockLength);
      });
    });
  });

  describe('/assets/:assets_id - PUT', () => {
    const assetsId = faker.helpers.arrayElement(mockList).id;

    it(`should update assets with id=${assetsId}`, () => {
      return assetsController.updateAssets(assetsId, mockItem).then((assets) => {
        expect(assets).not.toBeNull();
        expect(assets).not.toBeUndefined();
        expect(assets.asset).toBe(mockItem.asset);
        expect(assets.ticker).toBe(mockItem.ticker);
        expect(assets.asset_type_id).toBe(mockItem.asset_type_id);
        expect(assets.id).toBe(assetsId);
      });
    });
  });

  describe('/assets/:assets_id - PATCH', () => {
    const mockAssets = faker.helpers.arrayElement(mockList);
    const { asset, ticker, asset_type_id } = mockItem;

    it(`should partially update assets with id=${mockAssets.id} - only asset`, () => {
      return assetsController.partialUpdateAssets(mockAssets.id, { asset }).then((assets) => {
        expect(assets).not.toBeNull();
        expect(assets).not.toBeUndefined();
        expect(assets.asset).toBe(asset);
        expect(assets.ticker).toBe(mockAssets.ticker);
        expect(assets.asset_type_id).toBe(mockAssets.asset_type_id);
        expect(assets.id).toBe(mockAssets.id);
      });
    });

    it(`should partially update assets with id=${mockAssets.id} - only ticker`, () => {
      return assetsController.partialUpdateAssets(mockAssets.id, { ticker }).then((assets) => {
        expect(assets).not.toBeNull();
        expect(assets).not.toBeUndefined();
        expect(assets.asset).toBe(mockAssets.asset);
        expect(assets.ticker).toBe(ticker);
        expect(assets.asset_type_id).toBe(mockAssets.asset_type_id);
        expect(assets.id).toBe(mockAssets.id);
      });
    });

    it(`should partially update assets with id=${mockAssets.id} - only asset_type_id`, () => {
      return assetsController
        .partialUpdateAssets(mockAssets.id, { asset_type_id })
        .then((assets) => {
          expect(assets).not.toBeNull();
          expect(assets).not.toBeUndefined();
          expect(assets.asset).toBe(mockAssets.asset);
          expect(assets.ticker).toBe(mockAssets.ticker);
          expect(assets.asset_type_id).toBe(asset_type_id);
          expect(assets.id).toBe(mockAssets.id);
        });
    });
  });

  describe('/assets/:assets_id - DELETE', () => {
    const assetsId = faker.helpers.arrayElement(mockList).id;

    it(`should delete assets with id=${assetsId}`, () => {
      return assetsController.deleteAssets(assetsId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
