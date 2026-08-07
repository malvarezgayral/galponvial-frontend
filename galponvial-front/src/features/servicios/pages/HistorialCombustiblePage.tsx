import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehiculosService } from '@/features/vehiculos/services/vehiculosService';
import { combustibleService } from '../services/combustibleService';
import FiltrosHistorialCombustible from '../components/FiltrosHistorialCombustible';
import type { CombustibleCargaResponse, CombustibleHistorialFiltros } from '../types';

interface CargaConVehiculo extends CombustibleCargaResponse {
  tipo_combustible?: string;
  Galpón_Vial?: string;
}

const filtrosVacios: CombustibleHistorialFiltros = {
  periodo_desde: '',
  periodo_hasta: '',
  chofer: '',
  estacion_servicio: '',
  despachante: '',
  tipo_combustible: '',
  Galpón_Vial: '',
  km_actual: {},
  cant_combustible_despachado: {},
  litros_entrada: {},
  litros_salida: {},
  estado_parcial: '',
};

const HistorialCombustiblePage = () => {
  const navigate = useNavigate();
  const [cargas, setCargas] = useState<CargaConVehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<CombustibleHistorialFiltros>(filtrosVacios);

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        setLoading(true);
        const vehiculos = await vehiculosService.getAll();
        const resultados = await Promise.all(
          vehiculos.map((v) =>
            combustibleService
              .obtenerHistorial(v.id_vehiculo)
              .catch(() => [] as CombustibleCargaResponse[])
          )
        );
        const todas = resultados.flat();
        setCargas(todas);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar el historial';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    cargarTodo();
  }, []);

  const handleBuscar = (filtros: CombustibleHistorialFiltros) => {
    setFiltrosAplicados(filtros);
  };

  const cargasFiltradas = cargas.filter((c) => {
    if (filtrosAplicados.periodo_desde && c.fecha_carga < filtrosAplicados.periodo_desde) {
      return false;
    }
    if (filtrosAplicados.periodo_hasta && c.fecha_carga > filtrosAplicados.periodo_hasta) {
      return false;
    }
    if (
      filtrosAplicados.chofer &&
      !c.chofer?.toLowerCase().includes(filtrosAplicados.chofer.toLowerCase())
    ) {
      return false;
    }
    if (
      filtrosAplicados.estacion_servicio &&
      !c.estacion_servicio?.toLowerCase().includes(filtrosAplicados.estacion_servicio.toLowerCase())
    ) {
      return false;
    }
    if (filtrosAplicados.despachante && c.despachante !== filtrosAplicados.despachante) {
      return false;
    }
    if (filtrosAplicados.tipo_combustible && c.tipo_combustible !== filtrosAplicados.tipo_combustible) {
      return false;
    }
    if (filtrosAplicados.Galpón_Vial && c.Galpón_Vial !== filtrosAplicados.Galpón_Vial) {
      return false;
    }
    if (filtrosAplicados.estado_parcial && c.estado_parcial !== filtrosAplicados.estado_parcial) {
      return false;
    }
    if (
      filtrosAplicados.km_actual?.min !== undefined &&
      c.km_actual < filtrosAplicados.km_actual.min
    ) {
      return false;
    }
    if (
      filtrosAplicados.km_actual?.max !== undefined &&
      c.km_actual > filtrosAplicados.km_actual.max
    ) {
      return false;
    }
    if (
      filtrosAplicados.cant_combustible_despachado?.min !== undefined &&
      c.cant_combustible_despachado < filtrosAplicados.cant_combustible_despachado.min
    ) {
      return false;
    }
    if (
      filtrosAplicados.cant_combustible_despachado?.max !== undefined &&
      c.cant_combustible_despachado > filtrosAplicados.cant_combustible_despachado.max
    ) {
      return false;
    }
    if (
      filtrosAplicados.litros_entrada?.min !== undefined &&
      c.litros_entrada < filtrosAplicados.litros_entrada.min
    ) {
      return false;
    }
    if (
      filtrosAplicados.litros_entrada?.max !== undefined &&
      c.litros_entrada > filtrosAplicados.litros_entrada.max
    ) {
      return false;
    }
    if (
      filtrosAplicados.litros_salida?.min !== undefined &&
      c.litros_salida < filtrosAplicados.litros_salida.min
    ) {
      return false;
    }
    if (
      filtrosAplicados.litros_salida?.max !== undefined &&
      c.litros_salida > filtrosAplicados.litros_salida.max
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-nowrap gap-3 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => navigate('/servicios/combustible')}
            className="px-7 py-3 rounded-lg bg-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
          >
            Carga de Combustible
          </button>
          <button
            onClick={() => navigate('/servicios/combustible/listado')}
            className="px-7 py-3 rounded-lg bg-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
          >
            Listado Cargas
          </button>
          <button
            onClick={() => navigate('/servicios/combustible/historial')}
            className="px-7 py-3 rounded-lg bg-[#0062e3] text-white text-base font-semibold hover:bg-[#0054c2] transition-colors duration-200 cursor-pointer"
          >
            Historial de Carga de Combustible
          </button>
        </div>

        <FiltrosHistorialCombustible onBuscar={handleBuscar} />

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="mt-6 bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
            Cargando historial...
          </div>
        ) : (
          <div className="mt-6 bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-[1400px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Vehículo</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Fecha</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Chofer</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Estación</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Despachante</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Tipo combustible</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Galpón Vial</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">KM actual</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Cant. despachada</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Litros entrada</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Litros salida</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Estado parcial</th>
                </tr>
              </thead>
              <tbody>
                {cargasFiltradas.map((c) => (
                  <tr key={c.id_carga} className="border-b border-gray-100 last:border-0">
                    <td className="px-3 py-2 whitespace-nowrap">
                      {c.vehiculo ? `${c.vehiculo.codigo} - ${c.vehiculo.nombre}` : '—'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{c.fecha_carga}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{c.chofer}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{c.estacion_servicio}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{c.despachante || '—'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{c.tipo_combustible || '—'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{c.Galpón_Vial || '—'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{c.km_actual}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{c.cant_combustible_despachado}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{c.litros_entrada}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{c.litros_salida}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{c.estado_parcial}</td>
                  </tr>
                ))}
                {cargasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-3 py-6 text-center text-gray-400">
                      No se encontraron cargas de combustible con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialCombustiblePage;
