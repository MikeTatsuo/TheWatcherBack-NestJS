import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { assetPriceMock, createAssetPriceMock } from '@Mocks/asset_price';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { AssetsService } from '@/models/assets/assets.service';
import { AssetsEntity } from '@/models/assets/entities/assets.entity';
import { ValuesService } from '@/models/values/values.service';
import { ValuesEntity } from '@/models/values/entities/values.entity';

import { AssetPriceController } from '@/models/asset_price/asset_price.controller';
import { AssetPriceService } from '@/models/asset_price/asset_price.service';
import { AssetPriceEntity } from '@/models/asset_price/entities/asset_price.entity';

const mockList = MockHelper.generateList(assetPriceMock);
const createMockItem = createAssetPriceMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;

describe('AssetPriceController', () => {
  let assetPriceController: AssetPriceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AssetPriceController],
      providers: [
        AssetPriceService,
        AssetsService,
        ValuesService,
        {
          provide: getRepositoryToken(AssetPriceEntity),
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

    assetPriceController = app.get<AssetPriceController>(AssetPriceController);
  });

  describe('/asset_price - GET', () => {
    const paginationData = new PaginationOptionsDTO();
    const { page, per_page } = paginationData;
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of asset_price list', () => {
      return assetPriceController.getAll(paginationData).then((assetPriceList) => {
        expect(assetPriceList).not.toBeNull();
        expect(assetPriceList).not.toBeUndefined();
        expect(assetPriceList.data).not.toBeNull();
        expect(assetPriceList.data).not.toBeUndefined();
        expect(assetPriceList.page).toBe(page);
        expect(assetPriceList.perPage).toBe(per_page);
        expect(assetPriceList.total).toBe(mockLength);
        expect(assetPriceList.pageCount).toBe(pageCount);
        if (page > 1) expect(assetPriceList.hasPreviousPage).toBeTruthy();
        else expect(assetPriceList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(assetPriceList.hasNextPage).toBeTruthy();
        else expect(assetPriceList.hasNextPage).toBeFalsy();
        expect(assetPriceList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/asset_price/by_id/:asset_price_id - GET', () => {
    const assetPriceId = faker.helpers.arrayElement(mockList).id;
    const { date, id, value_id } = mockList.find((item) => item.id === assetPriceId);

    it(`should return asset_price with id=${assetPriceId}`, () => {
      return assetPriceController.getById(assetPriceId).then((assetPrice) => {
        expect(assetPrice).not.toBeNull();
        expect(assetPrice).not.toBeUndefined();
        expect(assetPrice.value_id).toBe(value_id);
        expect(assetPrice.date).toBe(date);
        expect(assetPrice.id).toBe(id);
      });
    });
  });

  describe('/asset_price - POST', () => {
    it('should create asset_price', () => {
      return assetPriceController.createAssetPrice(createMockItem).then((assetPrice) => {
        expect(assetPrice).not.toBeNull();
        expect(assetPrice).not.toBeUndefined();
        expect(assetPrice.date).toBe(createMockItem.date);
        expect(assetPrice.id).toBe(mockLength);
      });
    });
  });

  describe('/asset_price/:asset_price_id - PUT', () => {
    const assetPriceItem = faker.helpers.arrayElement(mockList);

    it(`should update asset_price with id=${assetPriceItem.id}`, () => {
      return assetPriceController
        .updateAssetPrice(assetPriceItem.id, createMockItem)
        .then((assetPrice) => {
          expect(assetPrice).not.toBeNull();
          expect(assetPrice).not.toBeUndefined();
          expect(assetPrice.date).toBe(createMockItem.date);
          expect(assetPrice.id).toBe(assetPriceItem.id);
        });
    });
  });

  describe('/asset_price/:asset_price_id - PATCH', () => {
    const assetPriceItem = faker.helpers.arrayElement(mockList);
    const { date } = createMockItem;

    it(`should partially update date with id=${assetPriceItem.id} - only date`, () => {
      return assetPriceController
        .partialUpdateAssetPrice(assetPriceItem.id, { date })
        .then((assetPrice) => {
          expect(assetPrice).not.toBeNull();
          expect(assetPrice).not.toBeUndefined();
          expect(assetPrice.id).toBe(assetPriceItem.id);
          expect(assetPrice.date).toBe(date);
        });
    });
  });

  describe('/asset_price/:asset_price_id - DELETE', () => {
    const assetPriceId = faker.helpers.arrayElement(mockList).id;

    it(`should delete asset_price with id=${assetPriceId}`, () => {
      return assetPriceController.deleteAssetPrice(assetPriceId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
