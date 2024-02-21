import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const countryMock = () => ({
  ...abstractMock(),
  code: faker.location.countryCode(),
  country: faker.location.country(),
});
