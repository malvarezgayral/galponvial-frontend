/**
 * Traduce al castellano los mensajes de validación (class-validator) que manda el backend en un 400.
 * - Reemplaza el nombre técnico del campo por su etiqueta (p. ej. infoAdicional.licencia_clase -> Clase).
 * - Si un mensaje no se reconoce, lo deja tal cual para no esconder el motivo real.
 * - Si un campo tiene varios errores, deja solo el primero.
 */

type Etiquetas = Record<string, string>;

const nombreCampo = (ruta: string): string => ruta.split('.').pop() ?? ruta;

const REGLAS: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [/^property (\S+) should not exist$/, () => 'no corresponde'],
  [/^nested property (\S+) must be either object or array$/, () => 'faltan datos'],
  [/^(\S+) should not be empty$/, () => 'es obligatorio'],
  [/^(\S+) must be a string$/, () => 'debe ser texto'],
  [/^(\S+) must be a number conforming to the specified constraints$/, () => 'debe ser un número'],
  [/^(\S+) must be an integer number$/, () => 'debe ser un número entero'],
  [/^(\S+) must be a boolean value$/, () => 'debe ser sí o no'],
  [/^(\S+) must be a valid ISO 8601 date string$/, () => 'debe ser una fecha válida'],
  [/^(\S+) must be an object$/, () => 'faltan datos'],
  [/^(\S+) must not be less than (\S+)$/, (m) => `debe ser como mínimo ${m[2]}`],
  [/^(\S+) must not be greater than (\S+)$/, (m) => `debe ser como máximo ${m[2]}`],
  [/^(\S+) must be one of the following values: (.*)$/, (m) => `debe ser uno de: ${m[2]}`],
  [/^(\S+) must be shorter than or equal to (\d+) characters$/, (m) => `debe tener como máximo ${m[2]} caracteres`],
  [/^(\S+) must be longer than or equal to (\d+) characters$/, (m) => `debe tener como mínimo ${m[2]} caracteres`],
  [/^(\S+) debe (.+)$/, (m) => `debe ${m[2].replace('YYYY-MM-DD', 'AAAA-MM-DD')}`],
];

export const traducirErroresValidacion = (mensajes: string[], etiquetas: Etiquetas): string[] => {
  const vistos = new Set<string>();
  const salida: string[] = [];
  for (const original of mensajes) {
    let clave = original;
    let texto = original;
    for (const [patron, traducir] of REGLAS) {
      const m = original.match(patron);
      if (m) {
        clave = nombreCampo(m[1]);
        texto = `${etiquetas[clave] ?? clave.replace(/_/g, ' ')}: ${traducir(m)}`;
        break;
      }
    }
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    salida.push(texto);
  }
  return salida;
};
