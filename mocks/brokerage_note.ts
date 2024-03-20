import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const brokerageNoteMock = () => ({
  ...abstractMock(),
  account_id: faker.number.int(),
  date: faker.date.recent(),
});
