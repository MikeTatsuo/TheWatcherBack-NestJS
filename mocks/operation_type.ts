import { faker } from '@faker-js/faker';

import { abstractMock } from '@Mocks/abstract';

export const operationTypeMock = () => ({
  ...abstractMock(),
  operation_code: faker.string.alpha({ length: { min: 1, max: 3 } }),
  operation_type: faker.lorem.word(),
  in_operation_type_id: faker.number.int(),
  in_registry_id: faker.number.int(),
});
