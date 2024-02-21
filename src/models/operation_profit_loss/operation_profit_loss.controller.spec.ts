import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import {
  createOperationProfitLossMock,
  operationProfitLossMock,
} from '@Mocks/operation_profit_loss';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { OperationProfitLossController } from '@/models/operation_profit_loss/operation_profit_loss.controller';
import { OperationProfitLossService } from '@/models/operation_profit_loss/operation_profit_loss.service';
import { OperationProfitLossEntity } from '@/models/operation_profit_loss/entities/operation_profit_loss.entity';
import { ValuesService } from '../values/values.service';
import { ValuesEntity } from '../values/entities/values.entity';
import { AssetsService } from '../assets/assets.service';
import { AssetsEntity } from '../assets/entities/assets.entity';

const mockList = MockHelper.generateList(operationProfitLossMock);
const createMockItem = createOperationProfitLossMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;
const paginationData = new PaginationOptionsDTO();
const { page, per_page } = paginationData;

describe('OperationProfitLossController', () => {
  let operationProfitLossController: OperationProfitLossController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OperationProfitLossController],
      providers: [
        AssetsService,
        OperationProfitLossService,
        ValuesService,
        {
          provide: getRepositoryToken(AssetsEntity),
          useValue,
        },
        {
          provide: getRepositoryToken(OperationProfitLossEntity),
          useValue,
        },
        {
          provide: getRepositoryToken(ValuesEntity),
          useValue,
        },
      ],
    }).compile();

    operationProfitLossController = app.get<OperationProfitLossController>(
      OperationProfitLossController,
    );
  });

  describe('/operation_profit_loss - GET', () => {
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of operation profit loss list', () => {
      return operationProfitLossController
        .getAll(paginationData)
        .then((operationProfitLossList) => {
          expect(operationProfitLossList).not.toBeNull();
          expect(operationProfitLossList).not.toBeUndefined();
          expect(operationProfitLossList.data).not.toBeNull();
          expect(operationProfitLossList.data).not.toBeUndefined();
          expect(operationProfitLossList.page).toBe(page);
          expect(operationProfitLossList.perPage).toBe(per_page);
          expect(operationProfitLossList.total).toBe(mockLength);
          expect(operationProfitLossList.pageCount).toBe(pageCount);
          if (page > 1) expect(operationProfitLossList.hasPreviousPage).toBeTruthy();
          else expect(operationProfitLossList.hasPreviousPage).toBeFalsy();
          if (pageCount > 1 && pageCount !== page)
            expect(operationProfitLossList.hasNextPage).toBeTruthy();
          else expect(operationProfitLossList.hasNextPage).toBeFalsy();
          expect(operationProfitLossList.data.length).toBe(dataLength);
        });
    });
  });

  describe('/operation_profit_loss/by_id/:operation_profit_loss_id - GET', () => {
    const { id, operation_id, value_id } = faker.helpers.arrayElement(mockList);

    it(`should return operation profit loss with id=${id}`, () => {
      return operationProfitLossController.getById(id).then((operationProfitLossList) => {
        expect(operationProfitLossList).not.toBeNull();
        expect(operationProfitLossList).not.toBeUndefined();
        expect(operationProfitLossList.operation_id).toBe(operation_id);
        expect(operationProfitLossList.value_id).toBe(value_id);
        expect(operationProfitLossList.id).toBe(id);
      });
    });
  });

  describe('/operation_profit_loss/by_operation_type/:operation_id - GET', () => {
    const { id, operation_id, value_id } = faker.helpers.arrayElement(mockList);

    it(`should return operation profit loss with operation_id=${operation_id}`, () => {
      return operationProfitLossController
        .getByOperation(operation_id)
        .then((operationProfitLossList) => {
          expect(operationProfitLossList).not.toBeNull();
          expect(operationProfitLossList).not.toBeUndefined();
          expect(operationProfitLossList.operation_id).toBe(operation_id);
          expect(operationProfitLossList.value_id).toBe(value_id);
          expect(operationProfitLossList.id).toBe(id);
        });
    });
  });

  describe('/operation_profit_loss - POST', () => {
    it('should create an operation profit loss', () => {
      return operationProfitLossController
        .createOperationProfitLoss(createMockItem)
        .then((operationProfitLossList) => {
          expect(operationProfitLossList).not.toBeNull();
          expect(operationProfitLossList).not.toBeUndefined();
          expect(operationProfitLossList.operation_id).toBe(createMockItem.operation_id);
          expect(operationProfitLossList.id).toBe(mockLength);
        });
    });
  });

  describe('/operation_profit_loss/:operation_profit_loss_id - PUT', () => {
    const { id } = faker.helpers.arrayElement(mockList);

    it(`should update an operation profit loss with id=${id}`, () => {
      return operationProfitLossController
        .updateOperationProfitLoss(id, createMockItem)
        .then((operationProfitLossList) => {
          expect(operationProfitLossList).not.toBeNull();
          expect(operationProfitLossList).not.toBeUndefined();
          expect(operationProfitLossList.operation_id).toBe(createMockItem.operation_id);
          expect(operationProfitLossList.id).toBe(id);
        });
    });
  });

  describe('/operation_profit_loss/:operation_profit_loss_id - PATCH', () => {
    const mockOperationProfitLoss = faker.helpers.arrayElement(mockList);
    const { operation_id, value, asset_id } = createMockItem;

    it(`should partially update an operation profit loss with id=${mockOperationProfitLoss.id} - only operation_id`, () => {
      return operationProfitLossController
        .partialUpdateOperationProfitLoss(mockOperationProfitLoss.id, { operation_id })
        .then((operationProfitLossList) => {
          expect(operationProfitLossList).not.toBeNull();
          expect(operationProfitLossList).not.toBeUndefined();
          expect(operationProfitLossList.operation_id).toBe(operation_id);
          expect(operationProfitLossList.value_id).toBe(mockOperationProfitLoss.value_id);
          expect(operationProfitLossList.id).toBe(mockOperationProfitLoss.id);
        });
    });

    it(`should partially update an operation profit loss with value=${mockOperationProfitLoss.id} - only value`, () => {
      return operationProfitLossController
        .partialUpdateOperationProfitLoss(mockOperationProfitLoss.id, { value })
        .then((operationProfitLossList) => {
          expect(operationProfitLossList).not.toBeNull();
          expect(operationProfitLossList).not.toBeUndefined();
          expect(operationProfitLossList.operation_id).toBe(mockOperationProfitLoss.operation_id);
          expect(operationProfitLossList.value_id).toBe(mockOperationProfitLoss.value_id);
          expect(operationProfitLossList.id).toBe(mockOperationProfitLoss.id);
        });
    });

    it(`should partially update an operation profit loss with id=${mockOperationProfitLoss.id} - only asset_id`, () => {
      return operationProfitLossController
        .partialUpdateOperationProfitLoss(mockOperationProfitLoss.id, { asset_id })
        .then((operationProfitLossList) => {
          expect(operationProfitLossList).not.toBeNull();
          expect(operationProfitLossList).not.toBeUndefined();
          expect(operationProfitLossList.operation_id).toBe(mockOperationProfitLoss.operation_id);
          expect(operationProfitLossList.value_id).toBe(mockOperationProfitLoss.value_id);
          expect(operationProfitLossList.id).toBe(mockOperationProfitLoss.id);
        });
    });
  });

  describe('/operation_profit_loss/:operation_profit_loss_id - DELETE', () => {
    const operationAssetId = faker.helpers.arrayElement(mockList).id;

    it(`should delete an operation profit loss with id=${operationAssetId}`, () => {
      return operationProfitLossController
        .deleteOperationProfitLoss(operationAssetId)
        .then((response) => {
          expect(response).not.toBeNull();
          expect(response).not.toBeUndefined();
          expect(response).toBe(1);
        });
    });
  });
});
