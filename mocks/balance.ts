import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const balanceMock = () => ({
  ...abstractMock(),
  account_id: faker.number.int(),
  value_id: faker.number.int(),
  date: faker.date.recent(),
  operation_id: faker.number.int(),
  assets: {
    id: faker.number.int(),
  },
});

export const updateBalanceMock = () => ({
  operation_id: faker.number.int(),
  account_id: faker.number.int(),
  asset_id: faker.number.int(),
  value: faker.number.float(),
  qtd: faker.number.int(),
  date: faker.date.recent(),
  add: faker.datatype.boolean(),
});
