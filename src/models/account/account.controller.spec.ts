import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { accountMock } from '@Mocks/account';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { AccountController } from '@/models/account/account.controller';
import { AccountService } from '@/models/account/account.service';
import { AccountEntity } from '@/models/account/entities/account.entity';

const mockList = MockHelper.generateList(accountMock);
const mockItem = accountMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;
const paginationData = new PaginationOptionsDTO();
const { page, per_page } = paginationData;

describe('AccountController', () => {
  let accountController: AccountController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(AccountEntity),
          useValue,
        },
      ],
    }).compile();

    accountController = app.get<AccountController>(AccountController);
  });

  describe('/account - GET', () => {
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of account list', () => {
      return accountController.getAll(paginationData).then((accountList) => {
        expect(accountList).not.toBeNull();
        expect(accountList).not.toBeUndefined();
        expect(accountList.data).not.toBeNull();
        expect(accountList.data).not.toBeUndefined();
        expect(accountList.page).toBe(page);
        expect(accountList.perPage).toBe(per_page);
        expect(accountList.total).toBe(mockLength);
        expect(accountList.pageCount).toBe(pageCount);
        if (page > 1) expect(accountList.hasPreviousPage).toBeTruthy();
        else expect(accountList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(accountList.hasNextPage).toBeTruthy();
        else expect(accountList.hasNextPage).toBeFalsy();
        expect(accountList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/account/by_id/:account_id - GET', () => {
    const { id, name, hash, institution_id, account_type_id, user_id } =
      faker.helpers.arrayElement(mockList);

    it(`should return account with id=${id}`, () => {
      return accountController.getById(id).then((account) => {
        expect(account).not.toBeNull();
        expect(account).not.toBeUndefined();
        expect(account.name).toBe(name);
        expect(account.hash).toBe(hash);
        expect(account.institution_id).toBe(institution_id);
        expect(account.account_type_id).toBe(account_type_id);
        expect(account.user_id).toBe(user_id);
        expect(account.id).toBe(id);
      });
    });
  });

  describe('/account/by_institution/:institution_id - GET', () => {
    const { institution_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.institution_id === institution_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of institution list with institution_id=${institution_id}`, () => {
      return accountController
        .getByInstitution(institution_id, paginationData)
        .then((accountList) => {
          expect(accountList).not.toBeNull();
          expect(accountList).not.toBeUndefined();
          expect(accountList.data).not.toBeNull();
          expect(accountList.data).not.toBeUndefined();
          expect(accountList.page).toBe(page);
          expect(accountList.perPage).toBe(per_page);
          expect(accountList.total).toBe(sampleLength);
          expect(accountList.pageCount).toBe(pageCount);
          if (page > 1) expect(accountList.hasPreviousPage).toBeTruthy();
          else expect(accountList.hasPreviousPage).toBeFalsy();
          if (pageCount > 1 && pageCount !== page) expect(accountList.hasNextPage).toBeTruthy();
          else expect(accountList.hasNextPage).toBeFalsy();
          expect(accountList.data.length).toBe(dataLength);
        });
    });
  });

  describe('/account/by_account_type/:account_type_id - GET', () => {
    const { account_type_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.account_type_id === account_type_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of institution list with account_type_id=${account_type_id}`, () => {
      return accountController
        .getByAccountType(account_type_id, paginationData)
        .then((accountList) => {
          expect(accountList).not.toBeNull();
          expect(accountList).not.toBeUndefined();
          expect(accountList.data).not.toBeNull();
          expect(accountList.data).not.toBeUndefined();
          expect(accountList.page).toBe(page);
          expect(accountList.perPage).toBe(per_page);
          expect(accountList.total).toBe(sampleLength);
          expect(accountList.pageCount).toBe(pageCount);
          if (page > 1) expect(accountList.hasPreviousPage).toBeTruthy();
          else expect(accountList.hasPreviousPage).toBeFalsy();
          if (pageCount > 1 && pageCount !== page) expect(accountList.hasNextPage).toBeTruthy();
          else expect(accountList.hasNextPage).toBeFalsy();
          expect(accountList.data.length).toBe(dataLength);
        });
    });
  });

  describe('/account - POST', () => {
    it('should create account', () => {
      return accountController.createAccount(mockItem).then((account) => {
        expect(account).not.toBeNull();
        expect(account).not.toBeUndefined();
        expect(account.name).toBe(mockItem.name);
        expect(account.hash).toBe(mockItem.hash);
        expect(account.institution_id).toBe(mockItem.institution_id);
        expect(account.account_type_id).toBe(mockItem.account_type_id);
        expect(account.user_id).toBe(mockItem.user_id);
        expect(account.id).toBe(mockLength);
      });
    });
  });

  describe('/account/:account_id - PUT', () => {
    const { id } = faker.helpers.arrayElement(mockList);

    it(`should update account with id=${id}`, () => {
      return accountController.updateAccount(id, mockItem).then((account) => {
        expect(account).not.toBeNull();
        expect(account).not.toBeUndefined();
        expect(account.name).toBe(mockItem.name);
        expect(account.hash).toBe(mockItem.hash);
        expect(account.institution_id).toBe(mockItem.institution_id);
        expect(account.account_type_id).toBe(mockItem.account_type_id);
        expect(account.user_id).toBe(mockItem.user_id);
        expect(account.id).toBe(id);
      });
    });
  });

  describe('/account/:account_id - PATCH', () => {
    const mockAccount = faker.helpers.arrayElement(mockList);
    const { name, hash, institution_id, account_type_id } = mockItem;

    it(`should partially update account with id=${mockAccount.id} - only name`, () => {
      return accountController.partialUpdateAccount(mockAccount.id, { name }).then((account) => {
        expect(account).not.toBeNull();
        expect(account).not.toBeUndefined();
        expect(account.name).toBe(name);
        expect(account.hash).toBe(mockAccount.hash);
        expect(account.institution_id).toBe(mockAccount.institution_id);
        expect(account.account_type_id).toBe(mockAccount.account_type_id);
        expect(account.user_id).toBe(mockAccount.user_id);
        expect(account.id).toBe(mockAccount.id);
      });
    });

    it(`should partially update account with id=${mockAccount.id} - only hash`, () => {
      return accountController.partialUpdateAccount(mockAccount.id, { hash }).then((account) => {
        expect(account).not.toBeNull();
        expect(account).not.toBeUndefined();
        expect(account.name).toBe(mockAccount.name);
        expect(account.hash).toBe(hash);
        expect(account.institution_id).toBe(mockAccount.institution_id);
        expect(account.account_type_id).toBe(mockAccount.account_type_id);
        expect(account.user_id).toBe(mockAccount.user_id);
        expect(account.id).toBe(mockAccount.id);
      });
    });

    it(`should partially update account with id=${mockAccount.id} - only institution_id`, () => {
      return accountController
        .partialUpdateAccount(mockAccount.id, { institution_id })
        .then((account) => {
          expect(account).not.toBeNull();
          expect(account).not.toBeUndefined();
          expect(account.name).toBe(mockAccount.name);
          expect(account.hash).toBe(mockAccount.hash);
          expect(account.institution_id).toBe(institution_id);
          expect(account.account_type_id).toBe(mockAccount.account_type_id);
          expect(account.user_id).toBe(mockAccount.user_id);
          expect(account.id).toBe(mockAccount.id);
        });
    });

    it(`should partially update account with id=${mockAccount.id} - only account_type_id`, () => {
      return accountController
        .partialUpdateAccount(mockAccount.id, { account_type_id })
        .then((account) => {
          expect(account).not.toBeNull();
          expect(account).not.toBeUndefined();
          expect(account.name).toBe(mockAccount.name);
          expect(account.hash).toBe(mockAccount.hash);
          expect(account.institution_id).toBe(mockAccount.institution_id);
          expect(account.account_type_id).toBe(account_type_id);
          expect(account.user_id).toBe(mockAccount.user_id);
          expect(account.id).toBe(mockAccount.id);
        });
    });
  });

  describe('/account/:account_id - DELETE', () => {
    const accountId = faker.helpers.arrayElement(mockList).id;

    it(`should delete account with id=${accountId}`, () => {
      return accountController.deleteAccount(accountId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
