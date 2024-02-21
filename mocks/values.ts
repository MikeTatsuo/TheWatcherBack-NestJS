import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const valuesMock = () => ({
  ...abstractMock(),
  value: faker.number.float(),
  asset_id: faker.number.int(),
});
