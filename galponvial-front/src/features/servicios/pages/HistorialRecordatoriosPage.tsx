import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recordatorioService } from '../services/recordatorioService';
import { ShareRecordatorioModal } from '../components/ShareRecordatorioModal';
import FiltrosHistorialRecordatorios from '../components/FiltrosHistorialRecordatorios';
import { useAppStore } from '@/app/stores/appStore';
import type { RecordatorioHistorialFiltros, RecordatorioResponse } from '../types';

const filtrosVacios: RecordatorioHistorialFiltros = {
  fecha_hora: '',
  periodo_desde: '',
  periodo_hasta: '',
  destinatario: '',
  vialidad: '',
};

const HistorialRecordatoriosPage = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [recordatorios, setRecordatorios] = useState<RecordatorioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<RecordatorioHistorialFiltros>(filtrosVacios);

  useEffect(() => {
    const cargar = async () => {
      if (!user?.dni) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const raw = await recordatorioService.obtenerHistorial(user.dni);
        const lista = Array.isArray(raw)
          ? raw
          : (raw as unknown as { data?: { data?: RecordatorioResponse[] } })?.data?.data ?? [];
        setRecordatorios(lista);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar el historial';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [user?.dni]);

  const handleBuscar = (filtros: RecordatorioHistorialFiltros) => {
    setFiltrosAplicados(filtros);
  };

  const recordatoriosFiltrados = recordatorios.filter((r) => {
    const fechaSolo = r.fecha?.slice(0, 10);
    if (filtrosAplicados.periodo_desde && fechaSolo < filtrosAplicados.periodo_desde) {
      return false;
    }
    if (filtrosAplicados.periodo_hasta && fechaSolo > filtrosAplicados.periodo_hasta) {
      return false;
    }
    if (
      filtrosAplicados.fecha_hora &&
      r.fecha?.replace(' ', 'T').slice(0, 16) !== filtrosAplicados.fecha_hora
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/servicios/recordatorio')}
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
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
            >
              Listado de Recordatorios
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors duration-200 cursor-pointer"
            >
              Historial de Recordatorios
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer whitespace-nowrap"
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
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
              />
            </svg>
            Compartir
          </button>
        </div>

        <FiltrosHistorialRecordatorios onBuscar={handleBuscar} />

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
            <table className="min-w-[700px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Fecha</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {recordatoriosFiltrados.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-3 py-2 whitespace-nowrap">{r.fecha}</td>
                    <td className="px-3 py-2 max-w-[400px]">{r.descripcion}</td>
                  </tr>
                ))}
                {recordatoriosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-3 py-6 text-center text-gray-400">
                      No se encontraron recordatorios con los filtros aplicados.
                    </td>
                  </tr>
                )}
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

export default HistorialRecordatoriosPage;
