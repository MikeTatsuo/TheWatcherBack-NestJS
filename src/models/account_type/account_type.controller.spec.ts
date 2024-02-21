import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { accountTypeMock } from '@Mocks/account_type';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { AccountTypeController } from '@/models/account_type/account_type.controller';
import { AccountTypeService } from '@/models/account_type/account_type.service';
import { AccountTypeEntity } from '@/models/account_type/entities/account_type.entity';

const mockList = MockHelper.generateList(accountTypeMock);
const mockItem = accountTypeMock();

const useValue = TestHelper(mockList);
const mockLength = mockList.length;

describe('AccountTypeController', () => {
  let accountTypeController: AccountTypeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountTypeController],
      providers: [
        AccountTypeService,
        {
          provide: getRepositoryToken(AccountTypeEntity),
          useValue,
        },
      ],
    }).compile();

    accountTypeController = app.get<AccountTypeController>(AccountTypeController);
  });

  describe('/account_type - GET', () => {
    const paginationData = new PaginationOptionsDTO();
    const { page, per_page } = paginationData;
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of account_type list', () => {
      return accountTypeController.getAll(paginationData).then((accountTypeList) => {
        expect(accountTypeList).not.toBeNull();
        expect(accountTypeList).not.toBeUndefined();
        expect(accountTypeList.data).not.toBeNull();
        expect(accountTypeList.data).not.toBeUndefined();
        expect(accountTypeList.page).toBe(page);
        expect(accountTypeList.perPage).toBe(per_page);
        expect(accountTypeList.total).toBe(mockLength);
        expect(accountTypeList.pageCount).toBe(pageCount);
        if (page > 1) expect(accountTypeList.hasPreviousPage).toBeTruthy();
        else expect(accountTypeList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(accountTypeList.hasNextPage).toBeTruthy();
        else expect(accountTypeList.hasNextPage).toBeFalsy();
        expect(accountTypeList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/account_type/by_id/:account_type_id - GET', () => {
    const accountTypeId = faker.helpers.arrayElement(mockList).id;
    const { account_type, id } = mockList.find((item) => item.id === accountTypeId);

    it(`should return account_type with id=${accountTypeId}`, () => {
      return accountTypeController.getById(accountTypeId).then((accountType) => {
        expect(accountType).not.toBeNull();
        expect(accountType).not.toBeUndefined();
        expect(accountType.account_type).toBe(account_type);
        expect(accountType.id).toBe(id);
      });
    });
  });

  describe('/account_type - POST', () => {
    it('should create account_type', () => {
      return accountTypeController.createAccountType(mockItem).then((accountType) => {
        expect(accountType).not.toBeNull();
        expect(accountType).not.toBeUndefined();
        expect(accountType.account_type).toBe(mockItem.account_type);
        expect(accountType.id).toBe(mockLength);
      });
    });
  });

  describe('/account_type/:account_type_id - PUT', () => {
    const accountTypeId = faker.helpers.arrayElement(mockList).id;

    it(`should update account_type with id=${accountTypeId}`, () => {
      return accountTypeController
        .updateAccountType(accountTypeId, mockItem)
        .then((accountType) => {
          expect(accountType).not.toBeNull();
          expect(accountType).not.toBeUndefined();
          expect(accountType.account_type).toBe(mockItem.account_type);
          expect(accountType.id).toBe(accountTypeId);
        });
    });
  });

  describe('/account_type/:account_type_id - PATCH', () => {
    const accountTypeId = faker.helpers.arrayElement(mockList).id;
    const { account_type } = mockItem;

    it(`should partially update account_type with id=${accountTypeId} - only account_type`, () => {
      return accountTypeController
        .partialUpdateAccountType(accountTypeId, { account_type })
        .then((accountType) => {
          expect(accountType).not.toBeNull();
          expect(accountType).not.toBeUndefined();
          expect(accountType.account_type).toBe(mockItem.account_type);
          expect(accountType.id).toBe(accountTypeId);
        });
    });
  });

  describe('/account_type/:account_type_id - DELETE', () => {
    const accountTypeId = faker.helpers.arrayElement(mockList).id;

    it(`should delete account_type with id=${accountTypeId}`, () => {
      return accountTypeController.deleteAccountType(accountTypeId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
