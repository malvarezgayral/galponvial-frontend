import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidenteService } from '../services/incidenteService';
import type { IncidenteResponse } from '../types';

const ListadoIncidentesPage = () => {
  const navigate = useNavigate();
  const [incidentes, setIncidentes] = useState<IncidenteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filaEditando, setFilaEditando] = useState<number | null>(null);
  const [borrador, setBorrador] = useState<IncidenteResponse | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const raw = await incidenteService.obtenerTodos();
        // Defensivo: por si la respuesta viene envuelta como { data: { data: [...] } }
        const lista = Array.isArray(raw)
          ? raw
          : (raw as unknown as { data?: { data?: IncidenteResponse[] } })?.data?.data ?? [];
        setIncidentes(lista);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar incidentes';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  const iniciarEdicion = (index: number) => {
    setFilaEditando(index);
    setBorrador({ ...incidentes[index] });
  };

  const cancelarEdicion = () => {
    setFilaEditando(null);
    setBorrador(null);
  };

  const guardarEdicion = () => {
    if (filaEditando !== null && borrador) {
      // TODO: conectar con el backend (PATCH /incidentes/:id/estado, y resto de campos si se agregan endpoints) cuando esté disponible
      setIncidentes((prev) => prev.map((inc, i) => (i === filaEditando ? borrador : inc)));
      setFilaEditando(null);
      setBorrador(null);
    }
  };

  const handleEliminar = (index: number, tipo: string, fecha: string) => {
    const confirmado = window.confirm(
      `¿Seguro que querés eliminar el incidente "${tipo}" del ${fecha}?`
    );
    if (confirmado) {
      // TODO: conectar con el backend (endpoint de eliminar incidente) cuando esté disponible
      setIncidentes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateBorrador = <K extends keyof IncidenteResponse>(field: K, value: IncidenteResponse[K]) => {
    setBorrador((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const inputClass =
    'border border-blue-300 rounded px-2 py-1 text-sm w-full min-w-[100px] bg-white';

  const ESTADO_OPTIONS = ['pendiente', 'en_proceso', 'resuelto', 'cancelado'];

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center">
        <p className="text-[var(--color-text-primary)]">Cargando listado...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/servicios')}
          className="flex items-center gap-2 text-[#378AFE] hover:text-[#0962DE] transition-colors duration-200 mb-6 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
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
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors duration-200 cursor-pointer"
          >
            Listado de Incidentes
          </button>
          <button
            type="button"
            onClick={() => navigate('/servicios/incidente/historial')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
          >
            Historial de Incidentes
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {incidentes.length === 0 && !error ? (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
            Todavía no hay incidentes registrados.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-[1200px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Vehículo</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Fecha</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Tipo</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Descripción</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Falla</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Estado</th>
                  <th className="text-right px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {incidentes.map((inc, index) => {
                  const editando = filaEditando === index && borrador !== null;
                  const fila = editando ? borrador : inc;

                  return (
                    <tr
                      key={inc.id}
                      className={`border-b border-gray-100 last:border-0 ${editando ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        {inc.vehiculo ? `${inc.vehiculo.codigo} - ${inc.vehiculo.nombre}` : '—'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="date"
                            value={fila.fecha}
                            onChange={(e) => updateBorrador('fecha', e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          inc.fecha
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="text"
                            value={fila.tipo}
                            onChange={(e) => updateBorrador('tipo', e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          inc.tipo
                        )}
                      </td>
                      <td className="px-3 py-2 max-w-[280px] truncate" title={inc.descripcion}>
                        {editando ? (
                          <input
                            type="text"
                            value={fila.descripcion}
                            onChange={(e) => updateBorrador('descripcion', e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          inc.descripcion
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="text"
                            value={fila.falla}
                            onChange={(e) => updateBorrador('falla', e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          inc.falla
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <select
                            value={fila.estado}
                            onChange={(e) => updateBorrador('estado', e.target.value)}
                            className={inputClass}
                          >
                            {ESTADO_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          inc.estado
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          {editando ? (
                            <>
                              <button
                                type="button"
                                onClick={guardarEdicion}
                                className="text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded px-3 py-1 transition-colors"
                              >
                                Guardar
                              </button>
                              <button
                                type="button"
                                onClick={cancelarEdicion}
                                className="text-gray-600 hover:text-gray-800 text-sm font-medium border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors"
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => iniciarEdicion(index)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 rounded px-3 py-1 hover:bg-blue-50 transition-colors"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEliminar(index, inc.tipo, inc.fecha)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 rounded px-3 py-1 hover:bg-red-50 transition-colors"
                              >
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListadoIncidentesPage;
