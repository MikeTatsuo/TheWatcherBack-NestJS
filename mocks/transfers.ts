import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const transfersMock = () => ({
  ...abstractMock(),
  operation_out_id: faker.number.int(),
  operation_in_id: faker.number.int(),
});

export const createTransfersMock = () => ({
  qtd: faker.number.int(),
  asset_id: faker.number.int(),
  operation_out_account_id: faker.number.int(),
  operation_out_date: faker.date.recent(),
  operation_out_ni_type: faker.number.int(),
  operation_in_account_id: faker.number.int(),
  operation_in_date: faker.date.recent(),
  operation_in_ni_type: faker.number.int(),
});
