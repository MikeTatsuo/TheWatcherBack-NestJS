import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { userMock } from '@Mocks/user';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { UserController } from '@/models/user/user.controller';
import { UserService } from '@/models/user/user.service';
import { UserEntity } from '@/models/user/entities/user.entity';

const mockList = MockHelper.generateList(userMock, ['username', 'token']);
const mockItem = userMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue,
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  describe('/user - GET', () => {
    const paginationData = new PaginationOptionsDTO();
    const { page, per_page } = paginationData;
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of user list', () => {
      return userController.getAll(paginationData).then((userList) => {
        expect(userList).not.toBeNull();
        expect(userList).not.toBeUndefined();
        expect(userList.data).not.toBeNull();
        expect(userList.data).not.toBeUndefined();
        expect(userList.page).toBe(page);
        expect(userList.perPage).toBe(per_page);
        expect(userList.total).toBe(mockLength);
        expect(userList.pageCount).toBe(pageCount);
        if (page > 1) expect(userList.hasPreviousPage).toBeTruthy();
        else expect(userList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(userList.hasNextPage).toBeTruthy();
        else expect(userList.hasNextPage).toBeFalsy();
        expect(userList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/user/by_id/:user_id - GET', () => {
    const { id, username } = faker.helpers.arrayElement(mockList);

    it(`should return user with id=${id}`, () => {
      return userController.getById(id).then((user) => {
        expect(user).not.toBeNull();
        expect(user).not.toBeUndefined();
        expect(user.username).toBe(username);
        expect(user.id).toBe(id);
      });
    });
  });

  describe('/user/by_username/:username - GET', () => {
    const { id, username } = faker.helpers.arrayElement(mockList);

    it(`should return user with username=${username}`, () => {
      return userController.getByUsername(username).then((user) => {
        expect(user).not.toBeNull();
        expect(user).not.toBeUndefined();
        expect(user.username).toBe(username);
        expect(user.id).toBe(id);
      });
    });
  });

  describe('/user - POST', () => {
    it('should create user', () => {
      return userController.createUser(mockItem).then((user) => {
        expect(user).not.toBeNull();
        expect(user).not.toBeUndefined();
        expect(user.username).toBe(mockItem.username);
        expect(user.id).toBe(mockLength);
      });
    });
  });

  describe('/user/:user_id - PUT', () => {
    const { id } = faker.helpers.arrayElement(mockList);

    it(`should update user with id=${id}`, () => {
      return userController.updateUser(id, mockItem).then((user) => {
        expect(user).not.toBeNull();
        expect(user).not.toBeUndefined();
        expect(user.username).toBe(mockItem.username);
        expect(user.id).toBe(id);
      });
    });
  });

  describe('/user/:user_id - PATCH', () => {
    const mockUser = faker.helpers.arrayElement(mockList);
    const { username, password, token } = mockItem;

    it(`should partially update user with id=${mockUser.id} - only username`, () => {
      return userController.partialUpdateUser(mockUser.id, { username }).then((user) => {
        expect(user).not.toBeNull();
        expect(user).not.toBeUndefined();
        expect(user.username).toBe(username);
        expect(user.id).toBe(mockUser.id);
      });
    });

    it(`should partially update user with id=${mockUser.id} - only password`, () => {
      return userController.partialUpdateUser(mockUser.id, { password }).then((user) => {
        expect(user).not.toBeNull();
        expect(user).not.toBeUndefined();
        expect(user.username).toBe(mockUser.username);
        expect(user.password).toBe(password);
        expect(user.id).toBe(mockUser.id);
      });
    });

    it(`should partially update user with id=${mockUser.id} - only token`, () => {
      return userController.partialUpdateUser(mockUser.id, { token }).then((user) => {
        expect(user).not.toBeNull();
        expect(user).not.toBeUndefined();
        expect(user.username).toBe(mockUser.username);
        expect(user.token).toBe(token);
        expect(user.id).toBe(mockUser.id);
      });
    });
  });

  describe('/user/:user_id - DELETE', () => {
    const userId = faker.helpers.arrayElement(mockList).id;
    it(`should delete user with id=${userId}`, () => {
      return userController.deleteUser(userId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
