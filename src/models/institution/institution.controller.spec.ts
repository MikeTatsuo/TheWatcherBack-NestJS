import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { institutionMock } from '@Mocks/institution';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { InstitutionController } from '@/models/institution/institution.controller';
import { InstitutionService } from '@/models/institution/institution.service';
import { InstitutionEntity } from '@/models/institution/entities/institution.entity';

const mockList = MockHelper.generateList(institutionMock, ['institution']);
const mockItem = institutionMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;
const paginationData = new PaginationOptionsDTO();
const { page, per_page } = paginationData;

describe('InstitutionController', () => {
  let institutionController: InstitutionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InstitutionController],
      providers: [
        InstitutionService,
        {
          provide: getRepositoryToken(InstitutionEntity),
          useValue,
        },
      ],
    }).compile();

    institutionController = app.get<InstitutionController>(InstitutionController);
  });

  describe('/institution - GET', () => {
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of institution list', () => {
      return institutionController.getAll(paginationData).then((institutionList) => {
        expect(institutionList).not.toBeNull();
        expect(institutionList).not.toBeUndefined();
        expect(institutionList.data).not.toBeNull();
        expect(institutionList.data).not.toBeUndefined();
        expect(institutionList.page).toBe(page);
        expect(institutionList.perPage).toBe(per_page);
        expect(institutionList.total).toBe(mockLength);
        expect(institutionList.pageCount).toBe(pageCount);
        if (page > 1) expect(institutionList.hasPreviousPage).toBeTruthy();
        else expect(institutionList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(institutionList.hasNextPage).toBeTruthy();
        else expect(institutionList.hasNextPage).toBeFalsy();
        expect(institutionList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/institution/by_id/:institution_id - GET', () => {
    const { id, institution, institution_type_id, country_id, url } =
      faker.helpers.arrayElement(mockList);

    it(`should return institution with id=${id}`, () => {
      return institutionController.getById(id).then((inst) => {
        expect(inst).not.toBeNull();
        expect(inst).not.toBeUndefined();
        expect(inst.institution).toBe(institution);
        expect(inst.institution_type_id).toBe(institution_type_id);
        expect(inst.country_id).toBe(country_id);
        expect(inst.url).toBe(url);
        expect(inst.id).toBe(id);
      });
    });
  });

  describe('/institution/by_institution_type/:institution_type_id - GET', () => {
    const { institution_type_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter(
      (item) => item.institution_type_id === institution_type_id,
    ).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of institution list with institution_type_id=${institution_type_id}`, () => {
      return institutionController
        .getByInstitutionType(institution_type_id, paginationData)
        .then((institutionList) => {
          expect(institutionList).not.toBeNull();
          expect(institutionList).not.toBeUndefined();
          expect(institutionList.data).not.toBeNull();
          expect(institutionList.data).not.toBeUndefined();
          expect(institutionList.page).toBe(page);
          expect(institutionList.perPage).toBe(per_page);
          expect(institutionList.total).toBe(sampleLength);
          expect(institutionList.pageCount).toBe(pageCount);
          if (page > 1) expect(institutionList.hasPreviousPage).toBeTruthy();
          else expect(institutionList.hasPreviousPage).toBeFalsy();
          if (pageCount > 1 && pageCount !== page) expect(institutionList.hasNextPage).toBeTruthy();
          else expect(institutionList.hasNextPage).toBeFalsy();
          expect(institutionList.data.length).toBe(dataLength);
        });
    });
  });

  describe('/institution/by_country/:country_id - GET', () => {
    const { country_id } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter((item) => item.country_id === country_id).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return page 1 of institution list with country_id=${country_id}`, () => {
      return institutionController
        .getByCountry(country_id, paginationData)
        .then((institutionList) => {
          expect(institutionList).not.toBeNull();
          expect(institutionList).not.toBeUndefined();
          expect(institutionList.data).not.toBeNull();
          expect(institutionList.data).not.toBeUndefined();
          expect(institutionList.page).toBe(page);
          expect(institutionList.perPage).toBe(per_page);
          expect(institutionList.total).toBe(sampleLength);
          expect(institutionList.pageCount).toBe(pageCount);
          if (page > 1) expect(institutionList.hasPreviousPage).toBeTruthy();
          else expect(institutionList.hasPreviousPage).toBeFalsy();
          if (pageCount > 1 && pageCount !== page) expect(institutionList.hasNextPage).toBeTruthy();
          else expect(institutionList.hasNextPage).toBeFalsy();
          expect(institutionList.data.length).toBe(dataLength);
        });
    });
  });

  describe('/institution - POST', () => {
    it('should create institution', () => {
      return institutionController.createInstitution(mockItem).then((inst) => {
        expect(inst).not.toBeNull();
        expect(inst).not.toBeUndefined();
        expect(inst.institution).toBe(mockItem.institution);
        expect(inst.institution_type_id).toBe(mockItem.institution_type_id);
        expect(inst.country_id).toBe(mockItem.country_id);
        expect(inst.url).toBe(mockItem.url);
        expect(inst.id).toBe(mockLength);
      });
    });
  });

  describe('/institution/:institution_id - PUT', () => {
    const institutionId = faker.helpers.arrayElement(mockList).id;

    it(`should update institution with id=${institutionId}`, () => {
      return institutionController.updateInstitution(institutionId, mockItem).then((inst) => {
        expect(inst).not.toBeNull();
        expect(inst).not.toBeUndefined();
        expect(inst.institution).toBe(mockItem.institution);
        expect(inst.institution_type_id).toBe(mockItem.institution_type_id);
        expect(inst.country_id).toBe(mockItem.country_id);
        expect(inst.url).toBe(mockItem.url);
        expect(inst.id).toBe(institutionId);
      });
    });
  });

  describe('/institution/:institution_id - PATCH', () => {
    const mockInstitution = faker.helpers.arrayElement(mockList);
    const { institution, institution_type_id, country_id, url } = mockItem;

    it(`should partially update institution with id=${mockInstitution.id} - only institution`, () => {
      return institutionController
        .partialUpdateInstitution(mockInstitution.id, { institution })
        .then((inst) => {
          expect(inst).not.toBeNull();
          expect(inst).not.toBeUndefined();
          expect(inst.institution).toBe(institution);
          expect(inst.institution_type_id).toBe(mockInstitution.institution_type_id);
          expect(inst.country_id).toBe(mockInstitution.country_id);
          expect(inst.url).toBe(mockInstitution.url);
          expect(inst.id).toBe(mockInstitution.id);
        });
    });

    it(`should partially update institution with id=${mockInstitution.id} - only institution_type_id`, () => {
      return institutionController
        .partialUpdateInstitution(mockInstitution.id, { institution_type_id })
        .then((inst) => {
          expect(inst).not.toBeNull();
          expect(inst).not.toBeUndefined();
          expect(inst.institution).toBe(mockInstitution.institution);
          expect(inst.institution_type_id).toBe(institution_type_id);
          expect(inst.country_id).toBe(mockInstitution.country_id);
          expect(inst.url).toBe(mockInstitution.url);
          expect(inst.id).toBe(mockInstitution.id);
        });
    });

    it(`should partially update institution with id=${mockInstitution.id} - only country_id`, () => {
      return institutionController
        .partialUpdateInstitution(mockInstitution.id, { country_id })
        .then((inst) => {
          expect(inst).not.toBeNull();
          expect(inst).not.toBeUndefined();
          expect(inst.institution).toBe(mockInstitution.institution);
          expect(inst.institution_type_id).toBe(mockInstitution.institution_type_id);
          expect(inst.country_id).toBe(country_id);
          expect(inst.url).toBe(mockInstitution.url);
          expect(inst.id).toBe(mockInstitution.id);
        });
    });

    it(`should partially update institution with id=${mockInstitution.id} - only url`, () => {
      return institutionController
        .partialUpdateInstitution(mockInstitution.id, { url })
        .then((inst) => {
          expect(inst).not.toBeNull();
          expect(inst).not.toBeUndefined();
          expect(inst.institution).toBe(mockInstitution.institution);
          expect(inst.institution_type_id).toBe(mockInstitution.institution_type_id);
          expect(inst.country_id).toBe(mockInstitution.country_id);
          expect(inst.url).toBe(url);
          expect(inst.id).toBe(mockInstitution.id);
        });
    });
  });

  describe('/institution/:institution_id - DELETE', () => {
    const institutionId = faker.helpers.arrayElement(mockList).id;
    it(`should delete institution with id=${institutionId}`, () => {
      return institutionController.deleteInstitution(institutionId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
