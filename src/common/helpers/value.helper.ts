export const ValueHelper = {
  correctValue: (value: number, positive: boolean) => {
    const inverter = (value >= 0 && positive) || (value < 0 && !positive) ? 1 : -1;
    return value * inverter;
  },
  correctQtd: (qtd: number, positive: boolean) => {
    const inverter = (qtd >= 0 && positive) || (qtd < 0 && !positive) ? 1 : -1;
    return qtd * inverter;
  },
};
