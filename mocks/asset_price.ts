import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const assetPriceMock = () => ({
  ...abstractMock(),
  date: faker.date.recent(),
  value_id: faker.number.int(),
});

export const createAssetPriceMock = () => ({
  date: faker.date.recent(),
  asset_id: faker.number.int(),
  value: faker.number.float(),
  qtd: faker.number.int(),
});
