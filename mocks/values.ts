import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const valuesMock = () => ({
  ...abstractMock(),
  value: faker.number.float(),
  qtd: faker.number.int(),
  asset_id: faker.number.int(),
});
