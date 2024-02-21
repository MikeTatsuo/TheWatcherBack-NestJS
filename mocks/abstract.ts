import { faker } from '@faker-js/faker';

export const abstractMock = () => ({
  created_at: faker.date.recent(),
  updated_at: faker.date.recent(),
  deleted_at: null,
});
