import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ESTACIONES_SERVICIO } from '../estacionesServicio';
import { TIPOS_COMBUSTIBLE } from '../tiposCombustible';
import { CHOFERES } from '../choferes';
import {
  combustibleCarroService,
  type CombustibleCarroResponse,
} from '../services/combustibleCarroService';

/**
 * Carga de Combustible (Carro)
 * Total combustible y Estado parcial se calculan (vista previa en pantalla;
 * el valor guardado lo calcula el backend).
 */

interface CarroFormData {
  maquina: string;
  fecha_carga: string;
  chofer: string;
  estacion_servicio: string;
  despachante: string;
  tipo_combustible: string;
  Galpón_Vial: string;
  litros_entrada: string;
  litros_salida: string;
  total_inicial: string;
  estado_parcial_inicial: string;
}

// "Depósito" siempre disponible + las estaciones de estacionesServicio.ts
const OPCIONES_ESTACION = Array.from(new Set(['Depósito', ...ESTACIONES_SERVICIO]));

const OPCIONES_GALPON_VIAL = ['Depósito (Galpón Vial)', 'Estación de Servicio'];

// Fecha local (evita que después de las 21 h tome el día siguiente)
const getToday = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().split('T')[0];
};

const buildEmptyForm = (): CarroFormData => ({
  maquina: '',
  fecha_carga: getToday(),
  chofer: '',
  estacion_servicio: '',
  despachante: '',
  tipo_combustible: '',
  Galpón_Vial: '',
  litros_entrada: '',
  litros_salida: '',
  total_inicial: '',
  estado_parcial_inicial: '',
});

const redondear = (n: number): number => Math.round(n * 100) / 100;

const labelClass = 'block text-sm font-medium text-[var(--color-text-primary)] mb-2';

const CombustibleCarroPage: React.FC = () => {
  const navigate = useNavigate();
  const todayString = getToday();

  const [formData, setFormData] = useState<CarroFormData>(buildEmptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Última carga registrada (base del cálculo). undefined = todavía cargando.
  const [ultima, setUltima] = useState<CombustibleCarroResponse | null | undefined>(undefined);
  const [errorBase, setErrorBase] = useState<string | null>(null);

  const cargarUltima = async () => {
    try {
      const todas = await combustibleCarroService.listar();
      // El backend devuelve ordenado por id_carro descendente: la primera es la última.
      setUltima(todas.length > 0 ? todas[0] : null);
      setErrorBase(null);
    } catch {
      setErrorBase('No se pudo consultar la última carga. Recargá la página antes de registrar.');
    }
  };

  useEffect(() => {
    cargarUltima();
  }, []);

  const esPrimeraCarga = ultima === null;

  const inputClass = (field: string) => `
    w-full px-4 py-2 border rounded-lg bg-white
    focus:outline-none focus:ring-2 focus:ring-[#378AFE]
    ${errors[field] ? 'border-red-500' : 'border-[var(--color-border-light)]'}
  `;

  const readOnlyClass =
    'w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg bg-gray-100 text-gray-700';

  const numOrZero = (v: string): number => {
    const n = Number(v);
    return v.trim() === '' || Number.isNaN(n) ? 0 : n;
  };

  // Vista previa del cálculo (mismas fórmulas que el backend)
  const entradaNum = numOrZero(formData.litros_entrada);
  const salidaNum = numOrZero(formData.litros_salida);
  let totalBase: number | null = null;
  let parcialBase: number | null = null;
  if (ultima) {
    totalBase = ultima.total_combustible;
    parcialBase = ultima.estado_parcial;
  } else if (ultima === null) {
    if (formData.total_inicial.trim() !== '') totalBase = numOrZero(formData.total_inicial);
    if (formData.estado_parcial_inicial.trim() !== '') parcialBase = numOrZero(formData.estado_parcial_inicial);
  }
  const totalPreview = totalBase === null ? '' : String(redondear(totalBase + entradaNum - salidaNum));
  const parcialPreview = parcialBase === null ? '' : String(redondear(parcialBase + salidaNum));

  const validateNumero = (value: string): string => {
    const n = Number(value);
    if (Number.isNaN(n) || n < 0) return 'Debe ser un número igual o mayor a 0';
    return '';
  };

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};

    if (!formData.maquina.trim()) e.maquina = 'La máquina es obligatoria';

    if (!formData.fecha_carga) {
      e.fecha_carga = 'La fecha de carga es obligatoria';
    } else if (formData.fecha_carga > todayString) {
      e.fecha_carga = 'La fecha no puede ser mayor al día actual';
    }
    if (!formData.chofer) e.chofer = 'El chofer es obligatorio';
    if (!formData.estacion_servicio) e.estacion_servicio = 'La estación de servicio es obligatoria';
    if (!formData.despachante.trim()) e.despachante = 'El despachante es obligatorio';
    if (!formData.tipo_combustible) e.tipo_combustible = 'El tipo de combustible es obligatorio';

    const tieneEntrada = formData.litros_entrada.trim() !== '' && Number(formData.litros_entrada) > 0;
    const tieneSalida = formData.litros_salida.trim() !== '' && Number(formData.litros_salida) > 0;

    if (formData.litros_entrada.trim() !== '') {
      const err = validateNumero(formData.litros_entrada);
      if (err) e.litros_entrada = err;
    }
    if (formData.litros_salida.trim() !== '') {
      const err = validateNumero(formData.litros_salida);
      if (err) e.litros_salida = err;
    }
    if (!e.litros_entrada && !e.litros_salida && tieneEntrada === tieneSalida) {
      const msg = 'Completá litros de entrada o litros de salida (uno solo, mayor a 0). No se pueden cargar los dos juntos ni ninguno.';
      e.litros_entrada = msg;
      e.litros_salida = msg;
    }

    if (esPrimeraCarga) {
      if (formData.total_inicial.trim() === '') {
        e.total_inicial = 'El total de combustible inicial es obligatorio en la primera carga';
      } else {
        const err = validateNumero(formData.total_inicial);
        if (err) e.total_inicial = err;
      }
      if (formData.estado_parcial_inicial.trim() === '') {
        e.estado_parcial_inicial = 'El estado parcial inicial es obligatorio en la primera carga';
      } else {
        const err = validateNumero(formData.estado_parcial_inicial);
        if (err) e.estado_parcial_inicial = err;
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = ev.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'litros_entrada' || name === 'litros_salida') {
      setErrors((prev) => ({ ...prev, litros_entrada: '', litros_salida: '' }));
    }
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSuccess(false);
    setGeneralError(null);
    if (ultima === undefined || errorBase) return;
    if (!validateForm()) return;

    setLoading(true);
    try {
      await combustibleCarroService.crear({
        maquina: formData.maquina.trim(),
        fecha_carga: formData.fecha_carga,
        chofer: formData.chofer,
        estacion_servicio: formData.estacion_servicio,
        despachante: formData.despachante.trim(),
        tipo_combustible: formData.tipo_combustible,
        ...(formData.Galpón_Vial ? { galpon_vial: formData.Galpón_Vial } : {}),
        ...(entradaNum > 0 ? { litros_entrada: entradaNum } : {}),
        ...(salidaNum > 0 ? { litros_salida: salidaNum } : {}),
        ...(esPrimeraCarga
          ? {
              total_inicial: Number(formData.total_inicial),
              estado_parcial_inicial: Number(formData.estado_parcial_inicial),
            }
          : {}),
      });
      setSuccess(true);
      setFormData(buildEmptyForm());
      setErrors({});
      await cargarUltima();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string | string[] } }; message?: string };
      const msg = err.response?.data?.message;
      setGeneralError(Array.isArray(msg) ? msg.join(', ') : msg || err.message || 'Error al registrar la carga');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(buildEmptyForm());
    setErrors({});
    setSuccess(false);
  };

  const navActive =
    'px-7 py-3 rounded-lg bg-[#0062e3] text-white text-base font-semibold hover:bg-[#0054c2] transition-colors duration-200 cursor-pointer';
  const navInactive =
    'px-7 py-3 rounded-lg bg-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-300 transition-colors duration-200 cursor-pointer';

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botones de navegación */}
        <div className="flex flex-nowrap justify-center gap-3 mb-6 overflow-x-auto pb-1">
          <button onClick={() => navigate('/servicios/combustible-carro')} className={navActive}>
            Carga de Combustible (Carro)
          </button>
          <button onClick={() => navigate('/servicios/combustible-carro/listado')} className={navInactive}>
            Listado Cargas
          </button>
          <button onClick={() => navigate('/servicios/combustible-carro/historial')} className={navInactive}>
            Historial de carga de combustible
          </button>
        </div>

        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
            Registrar Carga de Combustible (Carro)
          </h2>

          {errorBase && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
              <p className="text-red-700 font-medium">{errorBase}</p>
            </div>
          )}

          {generalError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
              <p className="text-red-700 font-medium">{generalError}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg">
              <p className="text-green-700 font-medium">
                Carga registrada correctamente.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Máquina */}
            <div>
              <label className={labelClass}>Máquina *</label>
              <input
                type="text"
                name="maquina"
                value={formData.maquina}
                onChange={handleChange}
                placeholder="Nombre o código de la máquina"
                className={inputClass('maquina')}
              />
              {errors.maquina && <p className="text-red-500 text-sm mt-1">{errors.maquina}</p>}
            </div>

            {/* Fecha de carga */}
            <div>
              <label className={labelClass}>Fecha de carga *</label>
              <input
                type="date"
                name="fecha_carga"
                value={formData.fecha_carga}
                max={todayString}
                onChange={handleChange}
                className={inputClass('fecha_carga')}
              />
              {errors.fecha_carga && <p className="text-red-500 text-sm mt-1">{errors.fecha_carga}</p>}
            </div>

            {/* Chofer */}
            <div>
              <label className={labelClass}>Chofer *</label>
              <select
                name="chofer"
                value={formData.chofer}
                onChange={handleChange}
                className={inputClass('chofer')}
              >
                <option value="">Seleccionar chofer...</option>
                {CHOFERES.map((chofer) => (
                  <option key={chofer} value={chofer}>
                    {chofer}
                  </option>
                ))}
              </select>
              {CHOFERES.length === 0 && (
                <p className="text-sm mt-1 text-[var(--color-text-secondary)]">
                  Todavía no hay choferes cargados.
                </p>
              )}
              {errors.chofer && <p className="text-red-500 text-sm mt-1">{errors.chofer}</p>}
            </div>

            {/* Estación de servicio */}
            <div>
              <label className={labelClass}>Estación de servicio *</label>
              <select
                name="estacion_servicio"
                value={formData.estacion_servicio}
                onChange={handleChange}
                className={inputClass('estacion_servicio')}
              >
                <option value="">Seleccionar estación...</option>
                {OPCIONES_ESTACION.map((estacion) => (
                  <option key={estacion} value={estacion}>
                    {estacion}
                  </option>
                ))}
              </select>
              {errors.estacion_servicio && (
                <p className="text-red-500 text-sm mt-1">{errors.estacion_servicio}</p>
              )}
            </div>

            {/* Despachante */}
            <div>
              <label className={labelClass}>Despachante *</label>
              <input
                type="text"
                name="despachante"
                value={formData.despachante}
                onChange={handleChange}
                placeholder="Nombre del despachante"
                className={inputClass('despachante')}
              />
              {errors.despachante && <p className="text-red-500 text-sm mt-1">{errors.despachante}</p>}
            </div>

            {/* Tipo de combustible */}
            <div>
              <label className={labelClass}>Tipo de combustible *</label>
              <select
                name="tipo_combustible"
                value={formData.tipo_combustible}
                onChange={handleChange}
                className={inputClass('tipo_combustible')}
              >
                <option value="">Seleccione un tipo...</option>
                {TIPOS_COMBUSTIBLE.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
              {errors.tipo_combustible && (
                <p className="text-red-500 text-sm mt-1">{errors.tipo_combustible}</p>
              )}
            </div>

            {/* Galpón Vial */}
            <div>
              <label className={labelClass}>
                Galpón Vial{' '}
                <span className="text-xs font-normal text-[var(--color-text-secondary)]">(Opcional)</span>
              </label>
              <select
                name="Galpón_Vial"
                value={formData.Galpón_Vial}
                onChange={handleChange}
                className={inputClass('Galpón_Vial')}
              >
                <option value="">Seleccione una opción...</option>
                {OPCIONES_GALPON_VIAL.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>

            {/* Valores iniciales: solo en la primera carga */}
            {esPrimeraCarga && (
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg space-y-6">
                <p className="text-sm text-[var(--color-text-primary)]">
                  Es la primera carga: completá los valores de partida. Se piden una sola vez.
                </p>
                <div>
                  <label className={labelClass}>Total de combustible inicial *</label>
                  <input
                    type="number"
                    name="total_inicial"
                    value={formData.total_inicial}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={inputClass('total_inicial')}
                  />
                  {errors.total_inicial && <p className="text-red-500 text-sm mt-1">{errors.total_inicial}</p>}
                </div>
                <div>
                  <label className={labelClass}>Estado parcial inicial *</label>
                  <input
                    type="number"
                    name="estado_parcial_inicial"
                    value={formData.estado_parcial_inicial}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={inputClass('estado_parcial_inicial')}
                  />
                  {errors.estado_parcial_inicial && (
                    <p className="text-red-500 text-sm mt-1">{errors.estado_parcial_inicial}</p>
                  )}
                </div>
              </div>
            )}

            {/* Litros de entrada */}
            <div>
              <label className={labelClass}>Litros de entrada</label>
              <input
                type="number"
                name="litros_entrada"
                value={formData.litros_entrada}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={inputClass('litros_entrada')}
              />
              {errors.litros_entrada && <p className="text-red-500 text-sm mt-1">{errors.litros_entrada}</p>}
            </div>

            {/* Litros de salida */}
            <div>
              <label className={labelClass}>Litros de salida</label>
              <input
                type="number"
                name="litros_salida"
                value={formData.litros_salida}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={inputClass('litros_salida')}
              />
              {errors.litros_salida && <p className="text-red-500 text-sm mt-1">{errors.litros_salida}</p>}
              <p className="text-xs mt-1 text-[var(--color-text-secondary)]">
                Completá solo uno: entrada o salida.
              </p>
            </div>

            {/* Total combustible (calculado) */}
            <div>
              <label className={labelClass}>Total combustible (calculado)</label>
              <input type="text" readOnly value={totalPreview} placeholder="Se calcula solo" className={readOnlyClass} />
            </div>

            {/* Estado parcial (calculado) */}
            <div>
              <label className={labelClass}>Estado parcial (calculado)</label>
              <input type="text" readOnly value={parcialPreview} placeholder="Se calcula solo" className={readOnlyClass} />
              <p className="text-xs mt-1 text-[var(--color-text-secondary)]">
                Vista previa. El valor que queda registrado lo calcula el sistema al guardar.
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading || ultima === undefined || !!errorBase}
                className="flex-1 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registrando...' : 'Registrar Carga'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
              >
                Limpiar
              </button>
            </div>

            <p className="text-sm text-[var(--color-text-secondary)] mt-4">* Campos obligatorios</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CombustibleCarroPage;
