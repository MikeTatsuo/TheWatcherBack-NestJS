import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const institutionTypeMock = () => ({
  ...abstractMock(),
  institution_type: faker.lorem.words(),
});
