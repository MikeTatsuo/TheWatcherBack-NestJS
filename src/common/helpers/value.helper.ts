export const ValueHelper = {
  correctValue: (value: number, positive: boolean) => {
    const inverter = (value >= 0 && positive) || (value < 0 && !positive) ? 1 : -1;
    return value * inverter;
  },
  correctQtd: (qtd: number, positive: boolean) => {
    const inverter = (qtd >= 0 && positive) || (qtd < 0 && !positive) ? 1 : -1;
    return qtd * inverter;
  },
  getValueByQtd: (qtd: number, balance_qtd: number, balance_value: number) => {
    return (qtd * balance_value) / balance_qtd;
  },
};
