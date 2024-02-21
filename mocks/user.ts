import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const userMock = () => ({
  ...abstractMock(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
  token: faker.lorem.word(),
});
