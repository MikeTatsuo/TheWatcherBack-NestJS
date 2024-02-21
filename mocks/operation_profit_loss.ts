import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const operationProfitLossMock = () => ({
  ...abstractMock(),
  operation_id: faker.number.int(),
  value_id: faker.number.int(),
});

export const createOperationProfitLossMock = () => ({
  ...abstractMock(),
  operation_id: faker.number.int(),
  value: faker.number.float(),
  asset_id: faker.number.int(),
});
