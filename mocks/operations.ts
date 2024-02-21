import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const operationsMock = () => ({
  ...abstractMock(),
  operation_type_id: faker.number.int(),
  account_id: faker.number.int(),
  ni_type_id: faker.number.int(),
  description: faker.lorem.words(),
  date: faker.date.recent(),
});

export const createOperationsMock = () => ({
  ...abstractMock(),
  operation_type_id: faker.number.int(),
  account_id: faker.number.int(),
  ni_type_id: faker.number.int(),
  description: faker.lorem.words(),
  date: faker.date.recent(),
  value_in: createOperationValueMock(),
  value_out: createOperationValueMock(),
});

const createOperationValueMock = () => ({
  value: faker.number.float(),
  asset: faker.finance.currencyCode(),
});
