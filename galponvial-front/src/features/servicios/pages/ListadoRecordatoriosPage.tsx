import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recordatorioService } from '../services/recordatorioService';
import { ShareRecordatorioModal } from '../components/ShareRecordatorioModal';
import { useAppStore } from '@/app/stores/appStore';
import type { RecordatorioResponse } from '../types';

const ListadoRecordatoriosPage = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [recordatorios, setRecordatorios] = useState<RecordatorioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filaEditando, setFilaEditando] = useState<number | null>(null);
  const [borrador, setBorrador] = useState<RecordatorioResponse | null>(null);

  useEffect(() => {
    const cargar = async () => {
      if (!user?.dni) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const raw = await recordatorioService.obtenerHistorial(user.dni);
        // Defensivo: por si la respuesta viene envuelta como { data: { data: [...] } }
        const lista = Array.isArray(raw)
          ? raw
          : (raw as unknown as { data?: { data?: RecordatorioResponse[] } })?.data?.data ?? [];
        setRecordatorios(lista);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar recordatorios';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [user?.dni]);

  const iniciarEdicion = (index: number) => {
    setFilaEditando(index);
    setBorrador({ ...recordatorios[index] });
  };

  const cancelarEdicion = () => {
    setFilaEditando(null);
    setBorrador(null);
  };

  const guardarEdicion = () => {
    if (filaEditando !== null && borrador) {
      // TODO: conectar con recordatorioService.updateRecordatorio cuando se decida hacerlo real
      setRecordatorios((prev) => prev.map((r, i) => (i === filaEditando ? borrador : r)));
      setFilaEditando(null);
      setBorrador(null);
    }
  };

  const handleEliminar = (index: number, descripcion: string) => {
    const confirmado = window.confirm(`¿Seguro que querés eliminar el recordatorio "${descripcion}"?`);
    if (confirmado) {
      // TODO: conectar con recordatorioService.deleteRecordatorio cuando se decida hacerlo real
      setRecordatorios((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateBorrador = <K extends keyof RecordatorioResponse>(field: K, value: RecordatorioResponse[K]) => {
    setBorrador((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const inputClass =
    'border border-blue-300 rounded px-2 py-1 text-sm w-full min-w-[100px] bg-white';

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center">
        <p className="text-[var(--color-text-primary)]">Cargando recordatorios...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
          <div className="flex-1 flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/servicios/recordatorio')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
            >
              Agregar Recordatorio
            </button>
            <button
              type="button"
              onClick={() => navigate('/servicios/recordatorio/listado')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors duration-200 cursor-pointer"
            >
              Listado de Recordatorios
            </button>
            <button
              type="button"
              onClick={() => navigate('/servicios/recordatorio/historial')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
            >
              Historial de Recordatorios
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            Compartir
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {recordatorios.length === 0 && !error ? (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
            Todavía no hay recordatorios registrados.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Fecha</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Descripción</th>
                  <th className="text-right px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recordatorios.map((r, index) => {
                  const editando = filaEditando === index && borrador !== null;
                  const fila = editando ? borrador : r;

                  return (
                    <tr
                      key={r.id}
                      className={`border-b border-gray-100 last:border-0 ${editando ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="datetime-local"
                            value={fila.fecha.replace(' ', 'T').slice(0, 16)}
                            onChange={(e) => updateBorrador('fecha', `${e.target.value.replace('T', ' ')}:00`)}
                            className={inputClass}
                          />
                        ) : (
                          r.fecha
                        )}
                      </td>
                      <td className="px-3 py-2 max-w-[400px]">
                        {editando ? (
                          <input
                            type="text"
                            value={fila.descripcion}
                            onChange={(e) => updateBorrador('descripcion', e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          r.descripcion
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
                                onClick={() => handleEliminar(index, r.descripcion)}
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
      <ShareRecordatorioModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};

export default ListadoRecordatoriosPage;
