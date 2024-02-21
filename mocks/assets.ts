import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const assetsMock = () => ({
  ...abstractMock(),
  ticker: faker.finance.currencyCode(),
  asset: faker.finance.currencyName(),
  asset_type_id: faker.number.int(),
});
