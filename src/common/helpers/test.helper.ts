import { Order } from '@/common/enums/order.enum';
import { FindQueryOptions } from '@/common/interfaces/ffind_query_options.interface';

type AbstractEntity = {
  id: number;
  [key: string]: unknown;
};

let tempData = undefined;

const createQueryBuilder = (mockData) => ({
  data: undefined,
  select: jest.fn().mockImplementation(() => {
    const data = tempData ?? mockData;
    tempData = data;
    return createQueryBuilder(data);
  }),
  addSelect: jest.fn().mockImplementation(() => {
    const data = tempData ?? mockData;
    tempData = data;
    return createQueryBuilder(data);
  }),
  groupBy: jest.fn().mockImplementation(() => {
    const data = tempData ?? mockData;
    tempData = data;
    return createQueryBuilder(data);
  }),
  where: jest.fn().mockImplementation((conditional: string, value: Record<string, unknown>) => {
    const data = tempData ?? mockData;
    const filteredMockData = data.filter((item) => {
      let correspond = true;

      Object.entries(value).forEach(([key, value]) => {
        correspond = correspond && item[key] === value;
      });

      return correspond;
    });

    tempData = filteredMockData;
    return createQueryBuilder(filteredMockData);
  }),
  getRawMany: jest.fn().mockImplementationOnce(() => {
    const data = tempData ?? mockData;
    tempData = data;
    return data;
  }),
  getCount: jest.fn().mockImplementation(() => {
    const data = tempData ?? mockData;
    tempData = data;
    return data.length;
  }),
  leftJoin: jest.fn().mockImplementation(() => {
    const data = tempData ?? mockData;
    tempData = data;
    return createQueryBuilder(data);
  }),
  orderBy: jest.fn().mockImplementation(() => {
    const data = tempData ?? mockData;
    tempData = data;
    return createQueryBuilder(data);
  }),
  distinctOn: jest.fn().mockImplementation((values: string[]) => {
    const data = tempData ?? mockData;
    const foundMockData = data.reduce((acc, item) => {
      const foundOnAcc = acc.find((accItem) => {
        let found = true;
        values.forEach((value) => {
          found = found && accItem[value] === item[value];
        });
        return found;
      });

      if (foundOnAcc) return acc;
      else return [...acc, item];
    }, []);

    tempData = foundMockData;
    return createQueryBuilder(foundMockData);
  }),
  addOrderBy: jest.fn().mockImplementation(() => {
    const data = tempData ?? mockData;
    tempData = data;
    return createQueryBuilder(data);
  }),
  offset: jest.fn().mockImplementation((offset: number) => {
    const data = tempData ?? mockData;
    const offsettedMockData = data.slice(offset);
    tempData = offsettedMockData;

    return createQueryBuilder(offsettedMockData);
  }),
  limit: jest.fn().mockImplementation((limit: number) => {
    const data = tempData ?? mockData;
    const limitedMockData = data.slice(0, limit);
    tempData = limitedMockData;

    return createQueryBuilder(limitedMockData);
  }),
  execute: jest.fn().mockImplementation(() => {
    const data = tempData ?? mockData;
    tempData = data;
    return data;
  }),
  clone: jest.fn().mockImplementation(() => {
    const data = tempData ?? mockData;
    tempData = data;
    return createQueryBuilder(data);
  }),
});

export const TestHelper = <Entity extends AbstractEntity>(mockData: Entity[]) => ({
  countBy: jest.fn().mockImplementation((obj: unknown) => {
    return new Promise((resolve) => {
      const [key, value] = Object.entries(obj).shift();
      resolve(mockData.filter((data) => data[key] === value).length);
    });
  }),
  createQueryBuilder: jest.fn().mockImplementation(() => createQueryBuilder(mockData)),
  find: jest.fn().mockImplementation((query: FindQueryOptions<Entity>) => {
    return new Promise((resolve) => {
      let returnData = mockData;
      if (query.where) {
        const [key, value] = Object.entries(query.where).shift();
        returnData = returnData.filter((data) => data[key] === value);
      }

      if (query.order) {
        const [key, order] = Object.entries(query.order).shift();
        const multiplier = order === Order.ASC ? 1 : -1;
        returnData = returnData.sort((itemA, itemB) =>
          itemA[key] > itemB[key] ? -1 * multiplier : itemA[key] < itemB[key] ? 1 * multiplier : 0,
        );
      }

      if (query.skip) returnData = returnData.slice(query.skip);
      if (query.take) returnData = returnData.slice(0, query.take);

      resolve(returnData);
    });
  }),
  findBy: jest.fn().mockImplementation((data: { [key: string]: string | number }) => {
    return new Promise((resolve) => {
      const [key, value] = Object.entries(data).shift();
      resolve(mockData.filter((item) => item[key] === value));
    });
  }),
  findOneBy: jest.fn().mockImplementation((data: { [key: string]: string | number }) => {
    return new Promise((resolve) => {
      const [key, value] = Object.entries(data).shift();
      const foundData = mockData.find((item) => item[key] === value);
      const returnData = tempData[key] === value ? tempData : foundData;
      resolve(returnData);
    });
  }),
  findOne: jest.fn().mockImplementation((query: FindQueryOptions<Entity>) => {
    return new Promise((resolve) => {
      const [key, value] = Object.entries(query.where).shift();
      resolve(mockData.find((item) => item[key] === value));
    });
  }),
  save: jest.fn().mockImplementation((data: Partial<Entity | Entity[]> | Entity | Entity[]) => {
    return new Promise((resolve) => {
      if (Array.isArray(data)) {
        const createdItems = data.map((itemData) => {
          const foundItem = mockData.find((item) => item.id === itemData.id);
          return { ...foundItem, ...data };
        });
        tempData = createdItems;
        resolve(createdItems);
      } else if (data.id) {
        const foundItem = mockData.find((item) => item.id === data.id);
        const mockItem = { ...foundItem, ...data };
        tempData = mockItem;
        resolve(mockItem);
      } else resolve({ ...data, id: mockData.length });
    });
  }),
  softDelete: jest.fn().mockImplementation((data: number | number[]) => {
    return new Promise((resolve) => {
      const affected = typeof data === 'number' ? 1 : data.length;
      resolve({ affected });
    });
  }),
  update: jest.fn().mockImplementation((id: number, data: Partial<Entity> | Entity) => {
    return new Promise((resolve) => {
      const mockItem = mockData.find((item) => item.id === id);
      const updatedMock = {
        id,
        ...mockItem,
        ...data,
      };

      resolve({ raw: updatedMock });
    });
  }),
});
