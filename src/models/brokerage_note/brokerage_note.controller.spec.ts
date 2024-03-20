import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { brokerageNoteMock } from '@Mocks/brokerage_note';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { BrokerageNoteController } from './brokerage_note.controller';
import { BrokerageNoteService } from './brokerage_note.service';
import { BrokerageNoteEntity } from './entities/brokerage_note.entity';

const mockList = MockHelper.generateList(brokerageNoteMock);
const mockItem = brokerageNoteMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;
const paginationData = new PaginationOptionsDTO();
const { page, per_page } = paginationData;

describe('BrokerageNoteController', () => {
  let brokerageNoteController: BrokerageNoteController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BrokerageNoteController],
      providers: [
        BrokerageNoteService,
        {
          provide: getRepositoryToken(BrokerageNoteEntity),
          useValue,
        },
      ],
    }).compile();

    brokerageNoteController = app.get<BrokerageNoteController>(BrokerageNoteController);
  });

  describe('/brokerage_note - GET', () => {
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of brokerageNote list', () => {
      return brokerageNoteController.getAll(paginationData).then((brokerageNoteList) => {
        expect(brokerageNoteList).not.toBeNull();
        expect(brokerageNoteList).not.toBeUndefined();
        expect(brokerageNoteList.data).not.toBeNull();
        expect(brokerageNoteList.data).not.toBeUndefined();
        expect(brokerageNoteList.page).toBe(page);
        expect(brokerageNoteList.perPage).toBe(per_page);
        expect(brokerageNoteList.total).toBe(mockLength);
        expect(brokerageNoteList.pageCount).toBe(pageCount);
        if (page > 1) expect(brokerageNoteList.hasPreviousPage).toBeTruthy();
        else expect(brokerageNoteList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(brokerageNoteList.hasNextPage).toBeTruthy();
        else expect(brokerageNoteList.hasNextPage).toBeFalsy();
        expect(brokerageNoteList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/brokerage_note/by_id/:brokerage_note - GET', () => {
    const { id, account_id, date } = faker.helpers.arrayElement(mockList);

    it(`should return brokerageNote with id=${id}`, () => {
      return brokerageNoteController.getById(id).then((brokerageNote) => {
        expect(brokerageNote).not.toBeNull();
        expect(brokerageNote).not.toBeUndefined();
        expect(brokerageNote.account_id).toBe(account_id);
        expect(brokerageNote.date).toBe(date);
        expect(brokerageNote.id).toBe(id);
      });
    });
  });

  describe('/brokerage_note/by_account/:account_id - GET', () => {
    const { account_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.account_id === account_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of brokerageNotes with account_id=${account_id}`, () => {
      return brokerageNoteController
        .getByAccount(account_id, paginationData)
        .then((brokerageNote) => {
          expect(brokerageNote).not.toBeNull();
          expect(brokerageNote).not.toBeUndefined();
          expect(brokerageNote.data).not.toBeNull();
          expect(brokerageNote.data).not.toBeUndefined();
          expect(brokerageNote.page).toBe(page);
          expect(brokerageNote.perPage).toBe(per_page);
          expect(brokerageNote.pageCount).toBe(pageCount);
          if (page > 1) expect(brokerageNote.hasPreviousPage).toBeTruthy();
          else expect(brokerageNote.hasPreviousPage).toBeFalsy();
          if (pageCount > 1 && pageCount !== page) expect(brokerageNote.hasNextPage).toBeTruthy();
          else expect(brokerageNote.hasNextPage).toBeFalsy();
          expect(brokerageNote.total).toBe(sampleLength);
          expect(brokerageNote.data.length).toBe(dataLength);
        });
    });
  });

  describe('/brokerage_note/by_date/:date - GET', () => {
    const { date } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.date === date).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of brokerageNotes with date=${date}`, () => {
      return brokerageNoteController.getByDate(date, paginationData).then((brokerageNote) => {
        expect(brokerageNote).not.toBeNull();
        expect(brokerageNote).not.toBeUndefined();
        expect(brokerageNote.data).not.toBeNull();
        expect(brokerageNote.data).not.toBeUndefined();
        expect(brokerageNote.page).toBe(page);
        expect(brokerageNote.perPage).toBe(per_page);
        expect(brokerageNote.total).toBe(sampleLength);
        expect(brokerageNote.pageCount).toBe(pageCount);
        if (page > 1) expect(brokerageNote.hasPreviousPage).toBeTruthy();
        else expect(brokerageNote.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(brokerageNote.hasNextPage).toBeTruthy();
        else expect(brokerageNote.hasNextPage).toBeFalsy();
        expect(brokerageNote.data.length).toBe(dataLength);
      });
    });
  });

  describe('/brokerage_note - POST', () => {
    it('should create brokerageNote', () => {
      return brokerageNoteController.createBrokerageNote(mockItem).then((brokerageNote) => {
        expect(brokerageNote).not.toBeNull();
        expect(brokerageNote).not.toBeUndefined();
        expect(brokerageNote.account_id).toBe(mockItem.account_id);
        expect(brokerageNote.date).toBe(mockItem.date);
        expect(brokerageNote.id).toBe(mockLength);
      });
    });
  });

  describe('/brokerage_note/:brokerage_note_id - PUT', () => {
    const mockListItem = faker.helpers.arrayElement(mockList);
    it(`should update brokerageNote with id=${mockListItem.id}`, () => {
      return brokerageNoteController
        .updateBrokerageNote(mockListItem.id, mockItem)
        .then((brokerageNote) => {
          expect(brokerageNote).not.toBeNull();
          expect(brokerageNote).not.toBeUndefined();
          expect(brokerageNote.account_id).toBe(mockItem.account_id);
          expect(brokerageNote.date).toBe(mockItem.date);
          expect(brokerageNote.id).toBe(mockListItem.id);
        });
    });
  });

  describe('/brokerage_note/:brokerage_note_id - PATCH', () => {
    const mockBrokerageNote = faker.helpers.arrayElement(mockList);
    const { account_id, date } = mockItem;

    it(`should partially update brokerageNote with id=${mockBrokerageNote.id} - only account_id`, () => {
      return brokerageNoteController
        .partialUpdateBrokerageNote(mockBrokerageNote.id, { account_id })
        .then((brokerageNote) => {
          expect(brokerageNote).not.toBeNull();
          expect(brokerageNote).not.toBeUndefined();
          expect(brokerageNote.account_id).toBe(account_id);
          expect(brokerageNote.date).toBe(mockBrokerageNote.date);
          expect(brokerageNote.id).toBe(mockBrokerageNote.id);
        });
    });

    it(`should partially update brokerageNote with id=${mockBrokerageNote.id} - only date`, () => {
      return brokerageNoteController
        .partialUpdateBrokerageNote(mockBrokerageNote.id, { date })
        .then((brokerageNote) => {
          expect(brokerageNote).not.toBeNull();
          expect(brokerageNote).not.toBeUndefined();
          expect(brokerageNote.account_id).toBe(mockBrokerageNote.account_id);
          expect(brokerageNote.date).toBe(date);
          expect(brokerageNote.id).toBe(mockBrokerageNote.id);
        });
    });
  });

  describe('/brokerage_note/:brokerageNote_id - DELETE', () => {
    const brokerageNoteId = faker.helpers.arrayElement(mockList).id;

    it(`should delete brokerageNote with id=${brokerageNoteId}`, () => {
      return brokerageNoteController.deleteBrokerageNote(brokerageNoteId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
