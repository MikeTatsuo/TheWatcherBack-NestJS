export const PapaparseHelper = {
  ptax: {
    transform: (value, column) => {
      switch (column) {
        case 0:
          return new Date(`${value.slice(2, 4)}-${value.slice(0, 2)}-${value.slice(-4)}`);
        case 3:
          return value;
        case 4:
        case 5:
          return Number(value.replace(',', '.'));
        default:
          return;
      }
    },
  },
};
