import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const institutionMock = () => ({
  ...abstractMock(),
  institution: faker.company.name(),
  url: faker.internet.url(),
  institution_type_id: faker.number.int(),
  country_id: faker.number.int(),
});
