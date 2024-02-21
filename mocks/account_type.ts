import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const accountTypeMock = () => ({
  ...abstractMock(),
  account_type: faker.lorem.word(),
});
