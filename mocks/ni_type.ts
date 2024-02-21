import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const niTypeMock = () => ({
  ...abstractMock(),
  ni_type: faker.lorem.words(),
  ni_code: faker.number.int(),
});
