import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const accountMock = () => ({
  ...abstractMock(),
  name: faker.lorem.word(),
  hash: faker.string.uuid(),
  institution_id: faker.number.int(),
  account_type_id: faker.number.int(),
  user_id: faker.number.int(),
});
