import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { inRegistryMock } from '@Mocks/in_registry';

import { TestHelper } from '@/common/helpers/test.helper';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { MockHelper } from '@/common/helpers/mock.helper';

import { INRegistryController } from '@/models/in_registry/in_registry.controller';
import { INRegistryService } from '@/models/in_registry/in_registry.service';
import { INRegistryEntity } from '@/models/in_registry/entities/in_registry.entity';

const mockList = MockHelper.generateList(inRegistryMock, ['registry_code']);
const mockItem = inRegistryMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;
const paginationData = new PaginationOptionsDTO();
const { page, per_page } = paginationData;

describe('INRegistryController', () => {
  let inRegistryController: INRegistryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [INRegistryController],
      providers: [
        INRegistryService,
        {
          provide: getRepositoryToken(INRegistryEntity),
          useValue,
        },
      ],
    }).compile();

    inRegistryController = app.get<INRegistryController>(INRegistryController);
  });

  describe('/in_registry - GET', () => {
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of in_registry list', () => {
      return inRegistryController.getAll(paginationData).then((inRegistryList) => {
        expect(inRegistryList).not.toBeNull();
        expect(inRegistryList).not.toBeUndefined();
        expect(inRegistryList.data).not.toBeNull();
        expect(inRegistryList.data).not.toBeUndefined();
        expect(inRegistryList.page).toBe(page);
        expect(inRegistryList.perPage).toBe(per_page);
        expect(inRegistryList.total).toBe(mockLength);
        expect(inRegistryList.pageCount).toBe(pageCount);
        if (page > 1) expect(inRegistryList.hasPreviousPage).toBeTruthy();
        else expect(inRegistryList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(inRegistryList.hasNextPage).toBeTruthy();
        else expect(inRegistryList.hasNextPage).toBeFalsy();
        expect(inRegistryList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/in_registry/by_id/:in_registry_id - GET', () => {
    const { id, registry_code, registry_hierarchy, description } =
      faker.helpers.arrayElement(mockList);

    it(`should return in_registry with id=${id}`, () => {
      return inRegistryController.getById(id).then((inRegistry) => {
        expect(inRegistry).not.toBeNull();
        expect(inRegistry).not.toBeUndefined();
        expect(inRegistry.registry_code).toBe(registry_code);
        expect(inRegistry.registry_hierarchy).toBe(registry_hierarchy);
        expect(inRegistry.description).toBe(description);
        expect(inRegistry.id).toBe(id);
      });
    });
  });

  describe('/in_registry/by_code/:in_registry_code - GET', () => {
    const { id, registry_code, registry_hierarchy, description } =
      faker.helpers.arrayElement(mockList);

    it(`should return in_registry with code=${registry_code}`, () => {
      return inRegistryController.getByCode(registry_code).then((inRegistry) => {
        expect(inRegistry).not.toBeNull();
        expect(inRegistry).not.toBeUndefined();
        expect(inRegistry.registry_code).toBe(registry_code);
        expect(inRegistry.registry_hierarchy).toBe(registry_hierarchy);
        expect(inRegistry.description).toBe(description);
        expect(inRegistry.id).toBe(id);
      });
    });
  });

  describe('/in_registry/by_hierarchy/:in_registry_hierarchy - GET', () => {
    const { registry_hierarchy } = faker.helpers.arrayElement(mockList);
    const sampleLength = mockList.filter(
      (item) => item.registry_hierarchy === registry_hierarchy,
    ).length;
    const pageCount = Math.ceil(sampleLength / per_page);
    const dataLength = sampleLength < per_page ? sampleLength : per_page;

    it(`should return in_registry list with registry_hierarchy=${registry_hierarchy}`, () => {
      return inRegistryController
        .getByHierarchy(registry_hierarchy, paginationData)
        .then((inRegistryList) => {
          expect(inRegistryList).not.toBeNull();
          expect(inRegistryList).not.toBeUndefined();
          expect(inRegistryList.data).not.toBeNull();
          expect(inRegistryList.data).not.toBeUndefined();
          expect(inRegistryList.page).toBe(page);
          expect(inRegistryList.perPage).toBe(per_page);
          expect(inRegistryList.total).toBe(sampleLength);
          expect(inRegistryList.pageCount).toBe(pageCount);
          if (page > 1) expect(inRegistryList.hasPreviousPage).toBeTruthy();
          else expect(inRegistryList.hasPreviousPage).toBeFalsy();
          if (pageCount > 1 && pageCount !== page) expect(inRegistryList.hasNextPage).toBeTruthy();
          else expect(inRegistryList.hasNextPage).toBeFalsy();
          expect(inRegistryList.data.length).toBe(dataLength);
        });
    });
  });

  describe('/in_registry - POST', () => {
    it('should create in_registry', () => {
      return inRegistryController.createINRegistry(mockItem).then((inRegistry) => {
        expect(inRegistry).not.toBeNull();
        expect(inRegistry).not.toBeUndefined();
        expect(inRegistry.registry_code).toBe(mockItem.registry_code);
        expect(inRegistry.registry_hierarchy).toBe(mockItem.registry_hierarchy);
        expect(inRegistry.description).toBe(mockItem.description);
        expect(inRegistry.id).toBe(mockLength);
      });
    });
  });

  describe('/in_registry/:in_registry_id - PUT', () => {
    const inRegistryId = faker.helpers.arrayElement(mockList).id;

    it(`should update in_registry with id=${inRegistryId}`, () => {
      return inRegistryController.updateINRegistry(inRegistryId, mockItem).then((inRegistry) => {
        expect(inRegistry).not.toBeNull();
        expect(inRegistry).not.toBeUndefined();
        expect(inRegistry.registry_code).toBe(mockItem.registry_code);
        expect(inRegistry.registry_hierarchy).toBe(mockItem.registry_hierarchy);
        expect(inRegistry.description).toBe(mockItem.description);
        expect(inRegistry.id).toBe(inRegistryId);
      });
    });
  });

  describe('/in_registry/:in_registry_id - PATCH', () => {
    const mockINRegistryData = faker.helpers.arrayElement(mockList);
    const { registry_code, registry_hierarchy, description } = mockItem;

    it(`should partially update in_registry with id=${mockINRegistryData.id} - only registry_code`, () => {
      return inRegistryController
        .partialUpdateINRegistry(mockINRegistryData.id, { registry_code })
        .then((inRegistry) => {
          expect(inRegistry).not.toBeNull();
          expect(inRegistry).not.toBeUndefined();
          expect(inRegistry.registry_code).toBe(registry_code);
          expect(inRegistry.registry_hierarchy).toBe(mockINRegistryData.registry_hierarchy);
          expect(inRegistry.description).toBe(mockINRegistryData.description);
          expect(inRegistry.id).toBe(mockINRegistryData.id);
        });
    });

    it(`should partially update in_registry with id=${mockINRegistryData.id} - only registry_hierarchy`, () => {
      return inRegistryController
        .partialUpdateINRegistry(mockINRegistryData.id, { registry_hierarchy })
        .then((inRegistry) => {
          expect(inRegistry).not.toBeNull();
          expect(inRegistry).not.toBeUndefined();
          expect(inRegistry.registry_code).toBe(mockINRegistryData.registry_code);
          expect(inRegistry.registry_hierarchy).toBe(registry_hierarchy);
          expect(inRegistry.description).toBe(mockINRegistryData.description);
          expect(inRegistry.id).toBe(mockINRegistryData.id);
        });
    });

    it(`should partially update in_registry with id=${mockINRegistryData.id} - only description`, () => {
      return inRegistryController
        .partialUpdateINRegistry(mockINRegistryData.id, { description })
        .then((inRegistry) => {
          expect(inRegistry).not.toBeNull();
          expect(inRegistry).not.toBeUndefined();
          expect(inRegistry.registry_code).toBe(mockINRegistryData.registry_code);
          expect(inRegistry.registry_hierarchy).toBe(mockINRegistryData.registry_hierarchy);
          expect(inRegistry.description).toBe(description);
          expect(inRegistry.id).toBe(mockINRegistryData.id);
        });
    });
  });

  describe('/in_registry/:in_registry_id - DELETE', () => {
    const inRegistryId = faker.helpers.arrayElement(mockList).id;

    it(`should delete in_registry with id=${inRegistryId}`, () => {
      return inRegistryController.deleteINRegistry(inRegistryId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
