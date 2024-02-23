import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const taxesMock = () => ({
  ...abstractMock(),
  tax_type_id: faker.number.int(),
  value_id: faker.number.int(),
  operation_id: faker.number.int(),
});

export const createTaxesMock = () => ({
  tax_type_id: faker.number.int(),
  operation_id: faker.number.int(),
  asset_id: faker.number.int(),
  value: faker.number.float(),
  qtd: faker.number.int(),
});
