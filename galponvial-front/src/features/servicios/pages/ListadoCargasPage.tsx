import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehiculosService } from '@/features/vehiculos/services/vehiculosService';
import { combustibleService } from '../services/combustibleService';
import type { CombustibleCargaResponse } from '../types';

interface CargaConVehiculo extends CombustibleCargaResponse {
  tipo_combustible?: string;
  Galpón_Vial?: string;
}

const ListadoCargasPage = () => {
  const navigate = useNavigate();
  const [cargas, setCargas] = useState<CargaConVehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filaEditando, setFilaEditando] = useState<number | null>(null);
  const [borrador, setBorrador] = useState<CargaConVehiculo | null>(null);

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
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar el listado';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    cargarTodo();
  }, []);

  const iniciarEdicion = (index: number) => {
    setFilaEditando(index);
    setBorrador({ ...cargas[index] });
  };

  const cancelarEdicion = () => {
    setFilaEditando(null);
    setBorrador(null);
  };

  const guardarEdicion = () => {
    if (filaEditando !== null && borrador) {
      // TODO: conectar con el backend (endpoint de actualizar carga) cuando esté disponible
      setCargas((prev) => prev.map((c, i) => (i === filaEditando ? borrador : c)));
      setFilaEditando(null);
      setBorrador(null);
    }
  };

  const handleEliminar = (index: number, chofer: string, fecha: string) => {
    const confirmado = window.confirm(
      `¿Seguro que querés eliminar la carga de ${chofer} del ${fecha}?`
    );
    if (confirmado) {
      // TODO: conectar con el backend (endpoint de eliminar carga) cuando esté disponible
      setCargas((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateBorrador = <K extends keyof CargaConVehiculo>(field: K, value: CargaConVehiculo[K]) => {
    setBorrador((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const inputClass =
    'border border-blue-300 rounded px-2 py-1 text-sm w-full min-w-[100px] bg-white';

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
        <div className="flex flex-nowrap gap-3 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => navigate('/servicios/combustible')}
            className="px-7 py-3 rounded-lg bg-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
          >
            Carga de Combustible
          </button>
          <button
            onClick={() => navigate('/servicios/combustible/listado')}
            className="px-7 py-3 rounded-lg bg-[#0062e3] text-white text-base font-semibold hover:bg-[#0054c2] transition-colors duration-200 cursor-pointer"
          >
            Listado Cargas
          </button>
          <button
            onClick={() => navigate('/servicios/combustible/historial')}
            className="px-7 py-3 rounded-lg bg-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
          >
            Historial de carga de combustible
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {cargas.length === 0 && !error ? (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
            Todavía no hay cargas de combustible registradas.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-[1600px] w-full text-sm">
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
                  <th className="text-right px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargas.map((c, index) => {
                  const editando = filaEditando === index && borrador !== null;
                  const fila = editando ? borrador : c;

                  return (
                    <tr
                      key={c.id_carga}
                      className={`border-b border-gray-100 last:border-0 ${editando ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        {c.vehiculo ? `${c.vehiculo.codigo} - ${c.vehiculo.nombre}` : '—'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="date"
                            value={fila.fecha_carga}
                            onChange={(e) => updateBorrador('fecha_carga', e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          c.fecha_carga
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="text"
                            value={fila.chofer}
                            onChange={(e) => updateBorrador('chofer', e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          c.chofer
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="text"
                            value={fila.estacion_servicio}
                            onChange={(e) => updateBorrador('estacion_servicio', e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          c.estacion_servicio
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="text"
                            value={fila.despachante || ''}
                            onChange={(e) => updateBorrador('despachante', e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          c.despachante || '—'
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="text"
                            value={fila.tipo_combustible || ''}
                            onChange={(e) => updateBorrador('tipo_combustible', e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          c.tipo_combustible || '—'
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="text"
                            value={fila.Galpón_Vial || ''}
                            onChange={(e) => updateBorrador('Galpón_Vial', e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          c.Galpón_Vial || '—'
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="number"
                            value={fila.km_actual}
                            onChange={(e) => updateBorrador('km_actual', parseFloat(e.target.value))}
                            className={inputClass}
                          />
                        ) : (
                          c.km_actual
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="number"
                            value={fila.cant_combustible_despachado}
                            onChange={(e) =>
                              updateBorrador('cant_combustible_despachado', parseFloat(e.target.value))
                            }
                            className={inputClass}
                          />
                        ) : (
                          c.cant_combustible_despachado
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="number"
                            value={fila.litros_entrada}
                            onChange={(e) => updateBorrador('litros_entrada', parseFloat(e.target.value))}
                            className={inputClass}
                          />
                        ) : (
                          c.litros_entrada
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="number"
                            value={fila.litros_salida}
                            onChange={(e) => updateBorrador('litros_salida', parseFloat(e.target.value))}
                            className={inputClass}
                          />
                        ) : (
                          c.litros_salida
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editando ? (
                          <input
                            type="text"
                            value={fila.estado_parcial}
                            onChange={(e) => updateBorrador('estado_parcial', e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          c.estado_parcial
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
                                onClick={() => handleEliminar(index, c.chofer, c.fecha_carga)}
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

export default ListadoCargasPage;
