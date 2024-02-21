import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const assetTypeMock = () => ({
  ...abstractMock(),
  asset_type: faker.lorem.word(),
});
