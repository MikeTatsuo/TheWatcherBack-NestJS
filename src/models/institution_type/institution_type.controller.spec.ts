import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { institutionTypeMock } from '@Mocks/institution_type';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { InstitutionTypeController } from '@/models/institution_type/institution_type.controller';
import { InstitutionTypeService } from '@/models/institution_type/institution_type.service';
import { InstitutionTypeEntity } from '@/models/institution_type/entities/institution_type.entity';

const mockList = MockHelper.generateList(institutionTypeMock, ['institution_type']);
const mockItem = institutionTypeMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;

describe('InstitutionTypeController', () => {
  let institutionTypeController: InstitutionTypeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InstitutionTypeController],
      providers: [
        InstitutionTypeService,
        {
          provide: getRepositoryToken(InstitutionTypeEntity),
          useValue,
        },
      ],
    }).compile();

    institutionTypeController = app.get<InstitutionTypeController>(InstitutionTypeController);
  });

  describe('/institution_type - GET', () => {
    const paginationData = new PaginationOptionsDTO();
    const { page, per_page } = paginationData;
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of institution_type list', () => {
      return institutionTypeController.getAll(paginationData).then((institutionTypeList) => {
        expect(institutionTypeList).not.toBeNull();
        expect(institutionTypeList).not.toBeUndefined();
        expect(institutionTypeList.data).not.toBeNull();
        expect(institutionTypeList.data).not.toBeUndefined();
        expect(institutionTypeList.page).toBe(page);
        expect(institutionTypeList.perPage).toBe(per_page);
        expect(institutionTypeList.total).toBe(mockLength);
        expect(institutionTypeList.pageCount).toBe(pageCount);
        if (page > 1) expect(institutionTypeList.hasPreviousPage).toBeTruthy();
        else expect(institutionTypeList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page)
          expect(institutionTypeList.hasNextPage).toBeTruthy();
        else expect(institutionTypeList.hasNextPage).toBeFalsy();
        expect(institutionTypeList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/institution_type/by_id/:institution_type_id - GET', () => {
    const { id, institution_type } = faker.helpers.arrayElement(mockList);

    it(`should return institution_type with id=${id}`, () => {
      return institutionTypeController.getById(id).then((institutionType) => {
        expect(institutionType).not.toBeNull();
        expect(institutionType).not.toBeUndefined();
        expect(institutionType.institution_type).toBe(institution_type);
        expect(institutionType.id).toBe(id);
      });
    });
  });

  describe('/institution_type - POST', () => {
    it('should create institution_type', () => {
      return institutionTypeController.createInstitutionType(mockItem).then((institutionType) => {
        expect(institutionType).not.toBeNull();
        expect(institutionType).not.toBeUndefined();
        expect(institutionType.institution_type).toBe(mockItem.institution_type);
        expect(institutionType.id).toBe(mockLength);
      });
    });
  });

  describe('/institution_type/:institution_type_id - PUT', () => {
    const { id } = faker.helpers.arrayElement(mockList);

    it(`should update institution_type with id=${id}`, () => {
      return institutionTypeController
        .updateInstitutionType(id, mockItem)
        .then((institutionType) => {
          expect(institutionType).not.toBeNull();
          expect(institutionType).not.toBeUndefined();
          expect(institutionType.institution_type).toBe(mockItem.institution_type);
          expect(institutionType.id).toBe(id);
        });
    });
  });

  describe('/institution_type/:institution_type_id - PATCH', () => {
    const mockInstitutionType = faker.helpers.arrayElement(mockList);
    const { institution_type } = mockItem;

    it(`should partially update institution_type with id=${mockInstitutionType.id} - only in_operation`, () => {
      return institutionTypeController
        .partialUpdateInstitutionType(mockInstitutionType.id, { institution_type })
        .then((institutionType) => {
          expect(institutionType).not.toBeNull();
          expect(institutionType).not.toBeUndefined();
          expect(institutionType.institution_type).toBe(institution_type);
          expect(institutionType.id).toBe(mockInstitutionType.id);
        });
    });
  });

  describe('/institution_type/:institution_type_id - DELETE', () => {
    const institutionTypeId = faker.helpers.arrayElement(mockList).id;

    it(`should delete institution_type with id=${institutionTypeId}`, () => {
      return institutionTypeController.deleteInstitutionType(institutionTypeId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
