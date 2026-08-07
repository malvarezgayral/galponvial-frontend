import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidenteService } from '../services/incidenteService';
import FiltrosHistorialIncidentes from '../components/FiltrosHistorialIncidentes';
import type { IncidenteHistorialFiltros, IncidenteResponse } from '../types';

const filtrosVacios: IncidenteHistorialFiltros = {
  periodo_desde: '',
  periodo_hasta: '',
  tipo: '',
  severidad: '',
  vehiculo: '',
  unidad: '',
};

const HistorialIncidentesPage = () => {
  const navigate = useNavigate();
  const [incidentes, setIncidentes] = useState<IncidenteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<IncidenteHistorialFiltros>(filtrosVacios);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const raw = await incidenteService.obtenerTodos();
        const lista = Array.isArray(raw)
          ? raw
          : (raw as unknown as { data?: { data?: IncidenteResponse[] } })?.data?.data ?? [];
        setIncidentes(lista);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar el historial';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  const handleBuscar = (filtros: IncidenteHistorialFiltros) => {
    setFiltrosAplicados(filtros);
  };

  const incidentesFiltrados = incidentes.filter((inc) => {
    if (filtrosAplicados.periodo_desde && inc.fecha < filtrosAplicados.periodo_desde) {
      return false;
    }
    if (filtrosAplicados.periodo_hasta && inc.fecha > filtrosAplicados.periodo_hasta) {
      return false;
    }
    if (filtrosAplicados.tipo && inc.tipo !== filtrosAplicados.tipo) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/servicios/incidente')}
          className="
            flex items-center gap-2 text-[#378AFE] hover:text-[#0962DE]
            transition-colors duration-200 mb-6 cursor-pointer
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Volver a Servicios
        </button>
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate('/servicios/incidente')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
          >
            Incidentes
          </button>
          <button
            type="button"
            onClick={() => navigate('/servicios/incidente/listado')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
          >
            Listado de Incidentes
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors duration-200 cursor-pointer"
          >
            Historial de Incidentes
          </button>
        </div>
        <FiltrosHistorialIncidentes onBuscar={handleBuscar} />

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
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Vehículo</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Fecha</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Tipo</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Descripción</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Falla</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Estado</th>
                </tr>
              </thead>
              <tbody>
                {incidentesFiltrados.map((inc) => (
                  <tr key={inc.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-3 py-2 whitespace-nowrap">
                      {inc.vehiculo ? `${inc.vehiculo.codigo} - ${inc.vehiculo.nombre}` : '—'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{inc.fecha}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{inc.tipo}</td>
                    <td className="px-3 py-2 max-w-[280px] truncate" title={inc.descripcion}>
                      {inc.descripcion}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{inc.falla}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{inc.estado}</td>
                  </tr>
                ))}
                {incidentesFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-gray-400">
                      No se encontraron incidentes con los filtros aplicados.
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
export default HistorialIncidentesPage;
