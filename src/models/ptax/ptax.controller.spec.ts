import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { createPtaxMock, ptaxMock } from '@Mocks/ptax';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { PtaxController } from '@/models/ptax/ptax.controller';
import { PtaxService } from '@/models/ptax/ptax.service';
import { PtaxEntity } from '@/models/ptax/entities/ptax.entity';
import { ValuesService } from '../values/values.service';
import { ValuesEntity } from '../values/entities/values.entity';
import { AssetsService } from '../assets/assets.service';
import { AssetsEntity } from '../assets/entities/assets.entity';

const mockList = MockHelper.generateList(ptaxMock);
const mockItem = createPtaxMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;

describe('PtaxController', () => {
  let ptaxController: PtaxController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PtaxController],
      providers: [
        AssetsService,
        PtaxService,
        ValuesService,
        {
          provide: getRepositoryToken(AssetsEntity),
          useValue,
        },
        {
          provide: getRepositoryToken(PtaxEntity),
          useValue,
        },
        {
          provide: getRepositoryToken(ValuesEntity),
          useValue,
        },
      ],
    }).compile();

    ptaxController = app.get<PtaxController>(PtaxController);
  });

  describe('/asset_price - GET', () => {
    const paginationData = new PaginationOptionsDTO();
    const { page, per_page } = paginationData;
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of asset_price list', () => {
      return ptaxController.getAll(paginationData).then((ptaxList) => {
        expect(ptaxList).not.toBeNull();
        expect(ptaxList).not.toBeUndefined();
        expect(ptaxList.data).not.toBeNull();
        expect(ptaxList.data).not.toBeUndefined();
        expect(ptaxList.page).toBe(page);
        expect(ptaxList.perPage).toBe(per_page);
        expect(ptaxList.total).toBe(mockLength);
        expect(ptaxList.pageCount).toBe(pageCount);
        if (page > 1) expect(ptaxList.hasPreviousPage).toBeTruthy();
        else expect(ptaxList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(ptaxList.hasNextPage).toBeTruthy();
        else expect(ptaxList.hasNextPage).toBeFalsy();
        expect(ptaxList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/asset_price/by_id/:asset_price_id - GET', () => {
    const ptaxId = faker.helpers.arrayElement(mockList).id;
    const { date, id, value_buy_id, value_sell_id } = mockList.find((item) => item.id === ptaxId);

    it(`should return asset_price with id=${ptaxId}`, () => {
      return ptaxController.getById(ptaxId).then((ptax) => {
        expect(ptax).not.toBeNull();
        expect(ptax).not.toBeUndefined();
        expect(ptax.value_buy_id).toBe(value_buy_id);
        expect(ptax.value_sell_id).toBe(value_sell_id);
        expect(ptax.date).toBe(date);
        expect(ptax.id).toBe(id);
      });
    });
  });

  describe('/asset_price - POST', () => {
    it('should create asset_price', () => {
      return ptaxController.createPtax(mockItem).then((ptax) => {
        expect(ptax).not.toBeNull();
        expect(ptax).not.toBeUndefined();
        expect(ptax.date).toBe(mockItem.date);
        expect(ptax.id).toBe(mockLength);
      });
    });
  });

  describe('/asset_price/:asset_price_id - PUT', () => {
    const ptaxId = faker.helpers.arrayElement(mockList).id;

    it(`should update asset_price with id=${ptaxId}`, () => {
      return ptaxController.updatePtax(ptaxId, mockItem).then((ptax) => {
        expect(ptax).not.toBeNull();
        expect(ptax).not.toBeUndefined();
        expect(ptax.date).toBe(mockItem.date);
        expect(ptax.id).toBe(ptaxId);
      });
    });
  });

  describe('/asset_price/:asset_price_id - PATCH', () => {
    const ptaxItem = faker.helpers.arrayElement(mockList);
    const { date, asset_id, value_buy, value_sell } = mockItem;

    it(`should partially update date with id=${ptaxItem.id} - only date`, () => {
      return ptaxController.partialUpdatePtax(ptaxItem.id, { date }).then((ptax) => {
        expect(ptax).not.toBeNull();
        expect(ptax).not.toBeUndefined();
        expect(ptax.value_buy_id).toBe(ptaxItem.value_buy_id);
        expect(ptax.value_sell_id).toBe(ptaxItem.value_sell_id);
        expect(ptax.date).toBe(date);
        expect(ptax.id).toBe(ptaxItem.id);
      });
    });

    it(`should partially update value_buy_id with id=${ptaxItem.id} - only value_buy`, () => {
      return ptaxController.partialUpdatePtax(ptaxItem.id, { value_buy }).then((ptax) => {
        expect(ptax).not.toBeNull();
        expect(ptax).not.toBeUndefined();
        expect(ptax.value_buy_id).toBe(ptaxItem.value_buy_id);
        expect(ptax.value_sell_id).toBe(ptaxItem.value_sell_id);
        expect(ptax.date).toBe(ptaxItem.date);
        expect(ptax.id).toBe(ptaxItem.id);
      });
    });

    it(`should partially update value_sell_id with id=${ptaxItem.id} - only value_sell`, () => {
      return ptaxController.partialUpdatePtax(ptaxItem.id, { value_sell }).then((ptax) => {
        expect(ptax).not.toBeNull();
        expect(ptax).not.toBeUndefined();
        expect(ptax.value_sell_id).toBe(ptaxItem.value_sell_id);
        expect(ptax.value_buy_id).toBe(ptaxItem.value_buy_id);
        expect(ptax.date).toBe(ptaxItem.date);
        expect(ptax.id).toBe(ptaxItem.id);
      });
    });

    it(`should partially update value_sell_id with id=${ptaxItem.id} - only asset_id`, () => {
      return ptaxController.partialUpdatePtax(ptaxItem.id, { asset_id }).then((ptax) => {
        expect(ptax).not.toBeNull();
        expect(ptax).not.toBeUndefined();
        expect(ptax.value_sell_id).toBe(ptaxItem.value_sell_id);
        expect(ptax.value_buy_id).toBe(ptaxItem.value_buy_id);
        expect(ptax.date).toBe(ptaxItem.date);
        expect(ptax.id).toBe(ptaxItem.id);
      });
    });
  });

  describe('/asset_price/:asset_price_id - DELETE', () => {
    const ptaxId = faker.helpers.arrayElement(mockList).id;

    it(`should delete asset_price with id=${ptaxId}`, () => {
      return ptaxController.deletePtax(ptaxId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
