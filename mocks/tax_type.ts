import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const taxTypeMock = () => ({
  ...abstractMock(),
  tax_type: faker.lorem.word(),
});
