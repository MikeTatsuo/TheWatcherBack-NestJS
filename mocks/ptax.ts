import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const ptaxMock = () => ({
  ...abstractMock(),
  date: faker.date.recent(),
  value_buy_id: faker.number.int(),
  value_sell_id: faker.number.int(),
});

export const createPtaxMock = () => ({
  date: faker.date.recent(),
  asset_id: faker.number.int(),
  value_buy: faker.number.float(),
  value_sell: faker.number.float(),
});
