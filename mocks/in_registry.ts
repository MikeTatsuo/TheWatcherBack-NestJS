import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const inRegistryMock = () => ({
  ...abstractMock(),
  registry_code: faker.number.int(),
  registry_hierarchy: faker.number.int(),
  description: faker.lorem.words(),
});
