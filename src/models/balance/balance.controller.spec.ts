import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { balanceMock, updateBalanceMock } from '@Mocks/balance';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { ValuesService } from '@/models/values/values.service';
import { ValuesEntity } from '@/models/values/entities/values.entity';
import { AssetsService } from '@/models/assets/assets.service';
import { AssetsEntity } from '@/models/assets/entities/assets.entity';

import { BalanceController } from '@/models/balance/balance.controller';
import { BalanceService } from '@/models/balance/balance.service';
import { BalanceEntity } from '@/models/balance/entities/balance.entity';

const mockList = MockHelper.generateList(balanceMock, ['account_id', 'value_id', 'operation_id']);
const mockItem = balanceMock();
const updateMockItem = updateBalanceMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;
const paginationData = new PaginationOptionsDTO();
const { page, per_page } = paginationData;

describe('BalanceController', () => {
  let balanceController: BalanceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        BalanceService,
        ValuesService,
        AssetsService,
        {
          provide: getRepositoryToken(BalanceEntity),
          useValue,
        },
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

    balanceController = app.get<BalanceController>(BalanceController);
  });

  describe('/balance - GET', () => {
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of balance list', () => {
      return balanceController.getAll(paginationData).then((balanceList) => {
        expect(balanceList).not.toBeNull();
        expect(balanceList).not.toBeUndefined();
        expect(balanceList.data).not.toBeNull();
        expect(balanceList.data).not.toBeUndefined();
        expect(balanceList.page).toBe(page);
        expect(balanceList.perPage).toBe(per_page);
        expect(balanceList.total).toBe(mockLength);
        expect(balanceList.pageCount).toBe(pageCount);
        if (page > 1) expect(balanceList.hasPreviousPage).toBeTruthy();
        else expect(balanceList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(balanceList.hasNextPage).toBeTruthy();
        else expect(balanceList.hasNextPage).toBeFalsy();
        expect(balanceList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/balance/by_id/:balance_id - GET', () => {
    const { id, account_id, value_id, date, operation_id } = faker.helpers.arrayElement(mockList);

    it(`should return balance with id=${id}`, () => {
      return balanceController.getById(id).then((balance) => {
        expect(balance).not.toBeNull();
        expect(balance).not.toBeUndefined();
        expect(balance.account_id).toBe(account_id);
        expect(balance.value_id).toBe(value_id);
        expect(balance.date).toBe(date);
        expect(balance.operation_id).toBe(operation_id);
        expect(balance.id).toBe(id);
      });
    });
  });

  describe('/balance/by_account/:account_id - GET', () => {
    const { account_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.account_id === account_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of balances with account_id=${account_id}`, () => {
      return balanceController.getByAccount(account_id, paginationData).then((balance) => {
        expect(balance).not.toBeNull();
        expect(balance).not.toBeUndefined();
        expect(balance.data).not.toBeNull();
        expect(balance.data).not.toBeUndefined();
        expect(balance.page).toBe(page);
        expect(balance.perPage).toBe(per_page);
        expect(balance.pageCount).toBe(pageCount);
        if (page > 1) expect(balance.hasPreviousPage).toBeTruthy();
        else expect(balance.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(balance.hasNextPage).toBeTruthy();
        else expect(balance.hasNextPage).toBeFalsy();
        expect(balance.total).toBe(sampleLength);
        expect(balance.data.length).toBe(dataLength);
      });
    });
  });

  describe('/balance/by_account_and_asset/:account_id - GET', () => {
    const { id, account_id, date, assets } = faker.helpers.arrayElement(mockList);

    it(`should return page 1 of balances with account_id=${account_id} and asset_id=${assets.id}`, () => {
      return balanceController.getByAccountAndTicker(account_id, assets.id).then((balance) => {
        expect(balance).not.toBeNull();
        expect(balance).not.toBeUndefined();
        expect(balance.date).toBe(date);
        expect(balance.id).toBe(id);
      });
    });
  });

  describe('/balance/by_account_asset_and_date/:account_id - GET', () => {
    const { id, account_id, date, assets } = faker.helpers.arrayElement(mockList);

    it(`should return page 1 of balances with account_id=${account_id}, asset_id=${assets.id} and date=${date}`, () => {
      return balanceController
        .getByAccountTickerAndDate(account_id, assets.id, date)
        .then((balance) => {
          expect(balance).not.toBeNull();
          expect(balance).not.toBeUndefined();
          expect(balance.date).toBe(date);
          expect(balance.id).toBe(id);
        });
    });
  });

  describe('/balance/by_date/:date - GET', () => {
    const { date } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.date === date).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of balances with date=${date}`, () => {
      return balanceController.getByDate(date, paginationData).then((balance) => {
        expect(balance).not.toBeNull();
        expect(balance).not.toBeUndefined();
        expect(balance.data).not.toBeNull();
        expect(balance.data).not.toBeUndefined();
        expect(balance.page).toBe(page);
        expect(balance.perPage).toBe(per_page);
        expect(balance.total).toBe(sampleLength);
        expect(balance.pageCount).toBe(pageCount);
        if (page > 1) expect(balance.hasPreviousPage).toBeTruthy();
        else expect(balance.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(balance.hasNextPage).toBeTruthy();
        else expect(balance.hasNextPage).toBeFalsy();
        expect(balance.data.length).toBe(dataLength);
      });
    });
  });

  describe('/balance/by_operation/:operation_id - GET', () => {
    const { operation_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.operation_id === operation_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return balance with code=${operation_id}`, () => {
      return balanceController.getByOperation(operation_id, paginationData).then((balance) => {
        expect(balance).not.toBeNull();
        expect(balance).not.toBeUndefined();
        expect(balance.data).not.toBeNull();
        expect(balance.data).not.toBeUndefined();
        expect(balance.page).toBe(page);
        expect(balance.perPage).toBe(per_page);
        expect(balance.total).toBe(sampleLength);
        expect(balance.pageCount).toBe(pageCount);
        if (page > 1) expect(balance.hasPreviousPage).toBeTruthy();
        else expect(balance.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(balance.hasNextPage).toBeTruthy();
        else expect(balance.hasNextPage).toBeFalsy();
        expect(balance.data.length).toBe(dataLength);
      });
    });
  });

  describe('/balance - POST', () => {
    it('should create balance', () => {
      return balanceController.createBalance(mockItem).then((balance) => {
        expect(balance).not.toBeNull();
        expect(balance).not.toBeUndefined();
        expect(balance.account_id).toBe(mockItem.account_id);
        expect(balance.value_id).toBe(mockItem.value_id);
        expect(balance.date).toBe(mockItem.date);
        expect(balance.operation_id).toBe(mockItem.operation_id);
        expect(balance.id).toBe(mockLength);
      });
    });
  });

  describe('/balance/:balance_id - PUT', () => {
    const mockListItem = faker.helpers.arrayElement(mockList);
    it(`should update balance with id=${mockListItem.id}`, () => {
      return balanceController.updateBalance(mockListItem.id, updateMockItem).then((balance) => {
        expect(balance).not.toBeNull();
        expect(balance).not.toBeUndefined();
        expect(balance.account_id).toBe(mockListItem.account_id);
        expect(balance.value_id).toBe(mockListItem.value_id);
        expect(balance.date).toBe(mockListItem.date);
        expect(balance.operation_id).toBe(mockListItem.operation_id);
        expect(balance.id).toBe(mockListItem.id);
      });
    });
  });

  describe('/balance/:balance_id - PATCH', () => {
    const mockBalance = faker.helpers.arrayElement(mockList);
    const { account_id, date, operation_id, asset_id, value, qtd } = updateMockItem;

    it(`should partially update balance with id=${mockBalance.id} - only account_id`, () => {
      return balanceController
        .partialUpdateBalance(mockBalance.id, { account_id })
        .then((balance) => {
          expect(balance).not.toBeNull();
          expect(balance).not.toBeUndefined();
          expect(balance.account_id).toBe(mockBalance.account_id);
          expect(balance.value_id).toBe(mockBalance.value_id);
          expect(balance.date).toBe(mockBalance.date);
          expect(balance.operation_id).toBe(mockBalance.operation_id);
          expect(balance.id).toBe(mockBalance.id);
        });
    });

    it(`should partially update balance with id=${mockBalance.id} - only value`, () => {
      return balanceController.partialUpdateBalance(mockBalance.id, { value }).then((balance) => {
        expect(balance).not.toBeNull();
        expect(balance).not.toBeUndefined();
        expect(balance.account_id).toBe(mockBalance.account_id);
        expect(balance.value_id).toBe(mockBalance.value_id);
        expect(balance.date).toBe(mockBalance.date);
        expect(balance.operation_id).toBe(mockBalance.operation_id);
        expect(balance.id).toBe(mockBalance.id);
      });
    });

    it(`should partially update balance with id=${mockBalance.id} - only date`, () => {
      return balanceController.partialUpdateBalance(mockBalance.id, { date }).then((balance) => {
        expect(balance).not.toBeNull();
        expect(balance).not.toBeUndefined();
        expect(balance.account_id).toBe(mockBalance.account_id);
        expect(balance.value_id).toBe(mockBalance.value_id);
        expect(balance.date).toBe(mockBalance.date);
        expect(balance.operation_id).toBe(mockBalance.operation_id);
        expect(balance.id).toBe(mockBalance.id);
      });
    });

    it(`should partially update balance with id=${mockBalance.id} - only asset_id`, () => {
      return balanceController
        .partialUpdateBalance(mockBalance.id, { asset_id })
        .then((balance) => {
          expect(balance).not.toBeNull();
          expect(balance).not.toBeUndefined();
          expect(balance.account_id).toBe(mockBalance.account_id);
          expect(balance.value_id).toBe(mockBalance.value_id);
          expect(balance.date).toBe(mockBalance.date);
          expect(balance.operation_id).toBe(mockBalance.operation_id);
          expect(balance.id).toBe(mockBalance.id);
        });
    });

    it(`should partially update balance with id=${mockBalance.id} - only operation_id`, () => {
      return balanceController
        .partialUpdateBalance(mockBalance.id, { operation_id })
        .then((balance) => {
          expect(balance).not.toBeNull();
          expect(balance).not.toBeUndefined();
          expect(balance.account_id).toBe(mockBalance.account_id);
          expect(balance.value_id).toBe(mockBalance.value_id);
          expect(balance.date).toBe(mockBalance.date);
          expect(balance.operation_id).toBe(mockBalance.operation_id);
          expect(balance.id).toBe(mockBalance.id);
        });
    });

    it(`should partially update balance with id=${mockBalance.id} - only qtd`, () => {
      return balanceController.partialUpdateBalance(mockBalance.id, { qtd }).then((balance) => {
        expect(balance).not.toBeNull();
        expect(balance).not.toBeUndefined();
        expect(balance.account_id).toBe(mockBalance.account_id);
        expect(balance.value_id).toBe(mockBalance.value_id);
        expect(balance.date).toBe(mockBalance.date);
        expect(balance.operation_id).toBe(mockBalance.operation_id);
        expect(balance.id).toBe(mockBalance.id);
      });
    });
  });

  describe('/balance/:balance_id - DELETE', () => {
    const balanceId = faker.helpers.arrayElement(mockList).id;

    it(`should delete balance with id=${balanceId}`, () => {
      return balanceController.deleteBalance(balanceId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
