import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { countryMock } from '@Mocks/country';

import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';
import { TestHelper } from '@/common/helpers/test.helper';
import { MockHelper } from '@/common/helpers/mock.helper';

import { CountryController } from '@/models/country/country.controller';
import { CountryService } from '@/models/country/country.service';
import { CountryEntity } from '@/models/country/entities/country.entity';

const mockList = MockHelper.generateList(countryMock, ['code', 'country']);
const mockItem = countryMock();
const useValue = TestHelper(mockList);
const mockLength = mockList.length;

describe('CountryController', () => {
  let countryController: CountryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [
        CountryService,
        {
          provide: getRepositoryToken(CountryEntity),
          useValue,
        },
      ],
    }).compile();

    countryController = app.get<CountryController>(CountryController);
  });

  describe('/country - GET', () => {
    const paginationData = new PaginationOptionsDTO();
    const { page, per_page } = paginationData;
    const pageCount = Math.ceil(mockLength / per_page);
    const dataLength = mockLength < per_page ? mockLength : per_page;

    it('should return page 1 of country list', () => {
      return countryController.getAll(new PaginationOptionsDTO()).then((countryList) => {
        expect(countryList).not.toBeNull();
        expect(countryList).not.toBeUndefined();
        expect(countryList.data).not.toBeNull();
        expect(countryList.data).not.toBeUndefined();
        expect(countryList.page).toBe(page);
        expect(countryList.perPage).toBe(per_page);
        expect(countryList.total).toBe(mockLength);
        expect(countryList.pageCount).toBe(pageCount);
        if (page > 1) expect(countryList.hasPreviousPage).toBeTruthy();
        else expect(countryList.hasPreviousPage).toBeFalsy();
        if (pageCount > 1 && pageCount !== page) expect(countryList.hasNextPage).toBeTruthy();
        else expect(countryList.hasNextPage).toBeFalsy();
        expect(countryList.data.length).toBe(dataLength);
      });
    });
  });

  describe('/country/by_id/:country_id - GET', () => {
    const { country, code, id } = faker.helpers.arrayElement(mockList);

    it(`should return country with id = ${id}`, () => {
      return countryController.getById(id).then((countryItem) => {
        expect(countryItem).not.toBeNull();
        expect(countryItem).not.toBeUndefined();
        expect(countryItem.country).toBe(country);
        expect(countryItem.code).toBe(code);
        expect(countryItem.id).toBe(id);
      });
    });
  });

  describe('/country/by_code/:country_code - GET', () => {
    const { country, code, id } = faker.helpers.arrayElement(mockList);

    it(`should return country with code = ${code}`, () => {
      return countryController.getByCode(code).then((countryItem) => {
        expect(countryItem).not.toBeNull();
        expect(countryItem).not.toBeUndefined();
        expect(countryItem.country).toBe(country);
        expect(countryItem.code).toBe(code);
        expect(countryItem.id).toBe(id);
      });
    });
  });

  describe('/country/by_name/:country_name - GET', () => {
    const { country, code, id } = faker.helpers.arrayElement(mockList);

    it(`should return country with name = ${country}`, () => {
      return countryController.getByName(country).then((countryItem) => {
        expect(countryItem).not.toBeNull();
        expect(countryItem).not.toBeUndefined();
        expect(countryItem.country).toBe(country);
        expect(countryItem.code).toBe(code);
        expect(countryItem.id).toBe(id);
      });
    });
  });

  describe('/country - POST', () => {
    it('should create country', () => {
      return countryController.createCountry(mockItem).then((countryItem) => {
        expect(countryItem).not.toBeNull();
        expect(countryItem).not.toBeUndefined();
        expect(countryItem.country).toBe(mockItem.country);
        expect(countryItem.code).toBe(mockItem.code);
        expect(countryItem.id).toBe(mockList.length);
      });
    });
  });

  describe('/country/:country_id - PUT', () => {
    const countryId = faker.helpers.arrayElement(mockList).id;

    it(`should update country with id=${countryId}`, () => {
      return countryController.updateCountry(countryId, mockItem).then((countryItem) => {
        expect(countryItem).not.toBeNull();
        expect(countryItem).not.toBeUndefined();
        expect(countryItem.country).toBe(mockItem.country);
        expect(countryItem.code).toBe(mockItem.code);
        expect(countryItem.id).toBe(countryId);
      });
    });
  });

  describe('/country/:country_id - PATCH', () => {
    const mockCountry = faker.helpers.arrayElement(mockList);
    const { code, country } = mockItem;

    it(`should partially update country with id=${mockCountry.id} - only code`, () => {
      return countryController
        .partialUpdateCountry(mockCountry.id, { code })
        .then((countryItem) => {
          expect(countryItem).not.toBeNull();
          expect(countryItem).not.toBeUndefined();
          expect(countryItem.country).toBe(mockCountry.country);
          expect(countryItem.code).toBe(code);
          expect(countryItem.id).toBe(mockCountry.id);
        });
    });

    it(`should partially update country with id=${mockCountry.id} - only country`, () => {
      return countryController
        .partialUpdateCountry(mockCountry.id, { country })
        .then((countryItem) => {
          expect(countryItem).not.toBeNull();
          expect(countryItem).not.toBeUndefined();
          expect(countryItem.country).toBe(country);
          expect(countryItem.code).toBe(mockCountry.code);
          expect(countryItem.id).toBe(mockCountry.id);
        });
    });
  });

  describe('/country/:country_id - DELETE', () => {
    const countryId = faker.helpers.arrayElement(mockList).id;

    it(`should delete country with id=${countryId}`, () => {
      return countryController.deleteCountry(countryId).then((response) => {
        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();
        expect(response).toBe(1);
      });
    });
  });
});
