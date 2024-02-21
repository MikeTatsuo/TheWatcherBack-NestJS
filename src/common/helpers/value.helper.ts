export const ValueHelper = {
  correctValue: (value: number, positive: boolean) => {
    const inverter = (value >= 0 && positive) || (value < 0 && !positive) ? 1 : -1;
    return value * inverter;
  },
};
