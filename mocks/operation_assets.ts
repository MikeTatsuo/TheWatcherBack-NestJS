import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const operationAssetsMock = () => ({
  ...abstractMock(),
  operation_id: faker.number.int(),
  value_id: faker.number.int(),
});
