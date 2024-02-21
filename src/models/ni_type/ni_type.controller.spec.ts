import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { niTypeMock } from '@Mocks/ni_type';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { NiTypeController } from '@/models/ni_type/ni_type.controller';
import { NiTypeService } from '@/models/ni_type/ni_type.service';
import { NiTypeEntity } from '@/models/ni_type/entities/ni_type.entity';

const mockList = MockHelper.generateList(niTypeMock, ['ni_type', 'ni_code']);
const mockItem = niTypeMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;

describe('NiTypeController', () => {
  let niTypeController: NiTypeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NiTypeController],
      providers: [
        NiTypeService,
        {
          provide: getRepositoryToken(NiTypeEntity),
          useValue,
        },
      ],
    }).compile();

    niTypeController = app.get<NiTypeController>(NiTypeController);
  });

  describe('/ni_type - GET', () => {
    const paginationData = new PaginationOptionsDTO();
    const { page, per_page } = paginationData;
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of ni_type list', () => {
      return niTypeController.getAll(paginationData).then((niTypeList) => {
        expect(niTypeList).not.toBeNull();
        expect(niTypeList).not.toBeUndefined();
        expect(niTypeList.data).not.toBeNull();
        expect(niTypeList.data).not.toBeUndefined();
        expect(niTypeList.page).toBe(page);
        expect(niTypeList.perPage).toBe(per_page);
        expect(niTypeList.total).toBe(mockLength);
        expect(niTypeList.pageCount).toBe(pageCount);
        if (page > 1) expect(niTypeList.hasPreviousPage).toBeTruthy();
        else expect(niTypeList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(niTypeList.hasNextPage).toBeTruthy();
        else expect(niTypeList.hasNextPage).toBeFalsy();
        expect(niTypeList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/ni_type/by_id/:ni_type_id - GET', () => {
    const { id, ni_code, ni_type } = faker.helpers.arrayElement(mockList);

    it(`should return ni_type with id=${id}`, () => {
      return niTypeController.getById(id).then((niType) => {
        expect(niType).not.toBeNull();
        expect(niType).not.toBeUndefined();
        expect(niType.ni_type).toBe(ni_type);
        expect(niType.ni_code).toBe(ni_code);
        expect(niType.id).toBe(id);
      });
    });
  });

  describe('/ni_type/by_code/:ni_type_code - GET', () => {
    const { id, ni_code, ni_type } = faker.helpers.arrayElement(mockList);

    it(`should return ni_type code with code=${ni_code}`, () => {
      return niTypeController.getByCode(ni_code).then((niType) => {
        expect(niType).not.toBeNull();
        expect(niType).not.toBeUndefined();
        expect(niType.ni_type).toBe(ni_type);
        expect(niType.ni_code).toBe(ni_code);
        expect(niType.id).toBe(id);
      });
    });
  });

  describe('/ni_type - POST', () => {
    it('should create ni_type', () => {
      return niTypeController.createNiType(mockItem).then((niType) => {
        expect(niType).not.toBeNull();
        expect(niType).not.toBeUndefined();
        expect(niType.ni_type).toBe(mockItem.ni_type);
        expect(niType.ni_code).toBe(mockItem.ni_code);
        expect(niType.id).toBe(mockList.length);
      });
    });
  });

  describe('/ni_type/:ni_type_id - PUT', () => {
    const { id } = faker.helpers.arrayElement(mockList);

    it(`should update ni_type with id=${id}`, () => {
      return niTypeController.updateNiType(id, mockItem).then((niType) => {
        expect(niType).not.toBeNull();
        expect(niType).not.toBeUndefined();
        expect(niType.ni_type).toBe(mockItem.ni_type);
        expect(niType.ni_code).toBe(mockItem.ni_code);
        expect(niType.id).toBe(id);
      });
    });
  });

  describe('/ni_type/:ni_type_id - PATCH', () => {
    const mockNiType = faker.helpers.arrayElement(mockList);
    const { ni_code, ni_type } = mockItem;

    it(`should partially update ni_type with id=${mockNiType.id} - only ni_code`, () => {
      return niTypeController.partialUpdateNiType(mockNiType.id, { ni_code }).then((niType) => {
        expect(niType).not.toBeNull();
        expect(niType).not.toBeUndefined();
        expect(niType.ni_type).toBe(mockNiType.ni_type);
        expect(niType.ni_code).toBe(ni_code);
        expect(niType.id).toBe(mockNiType.id);
      });
    });

    it(`should partially update ni_type with id=${mockNiType.id} - only ni_type`, () => {
      return niTypeController.partialUpdateNiType(mockNiType.id, { ni_type }).then((niType) => {
        expect(niType).not.toBeNull();
        expect(niType).not.toBeUndefined();
        expect(niType.ni_type).toBe(ni_type);
        expect(niType.ni_code).toBe(mockNiType.ni_code);
        expect(niType.id).toBe(mockNiType.id);
      });
    });
  });

  describe('/ni_type/:ni_type_id - DELETE', () => {
    const niTypeId = faker.helpers.arrayElement(mockList).id;

    it(`should delete ni_type with id=${niTypeId}`, () => {
      return niTypeController.deleteNiType(niTypeId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
