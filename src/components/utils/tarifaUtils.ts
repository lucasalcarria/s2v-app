// tarifaUtils.ts
export const defaultTarifa = {
  te: 0.29019,
  tusd: 0.33982,
  pis: 0.0097,
  cofins: 0.0444,
  icms: 0.19,
};

export function calcularTarifa({
  te,
  tusd,
  pis,
  cofins,
  icms,
}: typeof defaultTarifa): number {
  const denominador = (1 - icms) * (1 - (pis + cofins));
  const teComImposto = te / denominador;
  const tusdComImposto = tusd / denominador;
  const tarifa = teComImposto + tusdComImposto;
  return tarifa;
}
