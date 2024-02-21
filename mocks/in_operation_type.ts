import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const inOperationTypeMock = () => ({
  ...abstractMock(),
  in_operation: faker.lorem.words(),
  in_operation_code: faker.string.alpha({ length: { min: 1, max: 3 } }),
});
