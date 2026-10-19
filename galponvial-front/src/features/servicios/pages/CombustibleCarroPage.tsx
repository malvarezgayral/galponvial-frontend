import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ESTACIONES_SERVICIO } from '../estacionesServicio';
import { TIPOS_COMBUSTIBLE } from '../tiposCombustible';
import { CHOFERES } from '../choferes';

/**
 * Carga de Combustible (Carro)
 * Por ahora solo frontend: valida y guarda en estado local.
 */

interface CarroFormData {
  fecha_carga: string;
  chofer: string;
  estacion_servicio: string;
  despachante: string;
  tipo_combustible: string;
  Galpón_Vial: string;
  litros_entrada: string;
  litros_salida: string;
  estado_parcial: string;
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
  fecha_carga: getToday(),
  chofer: '',
  estacion_servicio: '',
  despachante: '',
  tipo_combustible: '',
  Galpón_Vial: '',
  litros_entrada: '',
  litros_salida: '',
  estado_parcial: '',
});

const labelClass = 'block text-sm font-medium text-[var(--color-text-primary)] mb-2';

const CombustibleCarroPage: React.FC = () => {
  const navigate = useNavigate();
  const todayString = getToday();

  const [formData, setFormData] = useState<CarroFormData>(buildEmptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const inputClass = (field: string) => `
    w-full px-4 py-2 border rounded-lg bg-white
    focus:outline-none focus:ring-2 focus:ring-[#378AFE]
    ${errors[field] ? 'border-red-500' : 'border-[var(--color-border-light)]'}
  `;

  const validateLitros = (value: string, mensajeVacio: string): string => {
    if (value.trim() === '') return mensajeVacio;
    const n = Number(value);
    if (Number.isNaN(n) || n < 0) return 'Debe ser un número igual o mayor a 0';
    return '';
  };

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};

    if (!formData.fecha_carga) {
      e.fecha_carga = 'La fecha de carga es obligatoria';
    } else if (formData.fecha_carga > todayString) {
      e.fecha_carga = 'La fecha no puede ser mayor al día actual';
    }
    if (!formData.chofer) e.chofer = 'El chofer es obligatorio';
    if (!formData.estacion_servicio) e.estacion_servicio = 'La estación de servicio es obligatoria';
    if (!formData.despachante.trim()) e.despachante = 'El despachante es obligatorio';
    if (!formData.tipo_combustible) e.tipo_combustible = 'El tipo de combustible es obligatorio';

    const errEntrada = validateLitros(formData.litros_entrada, 'Los litros de entrada son obligatorios');
    if (errEntrada) e.litros_entrada = errEntrada;
    const errSalida = validateLitros(formData.litros_salida, 'Los litros de salida son obligatorios');
    if (errSalida) e.litros_salida = errSalida;

    if (!formData.estado_parcial.trim()) e.estado_parcial = 'El estado parcial es obligatorio';

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
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setSuccess(false);
    if (!validateForm()) return;

    // TODO backend: enviar { ...formData, litros_entrada: Number(...), litros_salida: Number(...) }
    setSuccess(true);
    setFormData(buildEmptyForm());
    setErrors({});
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
          <button onClick={() => navigate('/servicios/combustible/listado')} className={navInactive}>
            Listado Cargas
          </button>
          <button onClick={() => navigate('/servicios/combustible/historial')} className={navInactive}>
            Historial de carga de combustible
          </button>
        </div>

        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
            Registrar Carga de Combustible (Carro)
          </h2>

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg">
              <p className="text-green-700 font-medium">
                Carga validada correctamente. Todavía no se guarda en el servidor.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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

            {/* Litros de entrada */}
            <div>
              <label className={labelClass}>Litros de entrada *</label>
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
              <label className={labelClass}>Litros de salida *</label>
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
            </div>

            {/* Estado parcial */}
            <div>
              <label className={labelClass}>Estado parcial *</label>
              <input
                type="text"
                name="estado_parcial"
                value={formData.estado_parcial}
                onChange={handleChange}
                placeholder="Descripción del estado parcial"
                className={inputClass('estado_parcial')}
              />
              {errors.estado_parcial && <p className="text-red-500 text-sm mt-1">{errors.estado_parcial}</p>}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors duration-200 cursor-pointer"
              >
                Registrar Carga
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
