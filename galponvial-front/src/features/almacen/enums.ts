export const MovimientoTipo = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
} as const;

export type MovimientoTipo = typeof MovimientoTipo[keyof typeof MovimientoTipo];