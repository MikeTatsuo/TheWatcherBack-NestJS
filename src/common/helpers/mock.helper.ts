import { faker } from '@faker-js/faker';

const min = 1;
const max = 30;

export const MockHelper = {
  generateList: (item, uniqueItemsKey?: string[]) => [
    ...Array(faker.number.int({ min, max }))
      .fill(null)
      .map(() => ({ id: faker.number.int(), ...item() }))
      .reduce((reducedList, reduceItem) => {
        let found = !uniqueItemsKey;

        uniqueItemsKey?.forEach((key) => {
          found =
            found ||
            !reducedList.find(
              (listItem) => listItem[key] === reduceItem[key] && listItem.id !== reduceItem.id,
            );
        });

        return found ? [...reducedList, reduceItem] : reducedList;
      }, []),
  ],
};
