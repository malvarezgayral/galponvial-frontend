import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  combustibleCarroService,
  type CombustibleCarroResponse,
} from '../services/combustibleCarroService';

interface FiltrosCarro {
  desde: string;
  hasta: string;
  maquina: string;
  chofer: string;
  estacion: string;
  despachante: string;
  tipo: string;
  parcialMin: string;
  parcialMax: string;
}

const filtrosVacios: FiltrosCarro = {
  desde: '',
  hasta: '',
  maquina: '',
  chofer: '',
  estacion: '',
  despachante: '',
  tipo: '',
  parcialMin: '',
  parcialMax: '',
};

const contiene = (valor: string | null | undefined, filtro: string) =>
  !filtro || (valor ?? '').toLowerCase().includes(filtro.toLowerCase());

const navActive =
  'px-7 py-3 rounded-lg bg-[#0062e3] text-white text-base font-semibold hover:bg-[#0054c2] transition-colors duration-200 cursor-pointer';
const navInactive =
  'px-7 py-3 rounded-lg bg-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-300 transition-colors duration-200 cursor-pointer';
const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm';
const labelCls = 'block text-sm text-[var(--color-text-secondary)] mb-1';
const thCls = 'text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap';
const tdCls = 'px-3 py-2 whitespace-nowrap';

const CarroListadoPage = () => {
  const navigate = useNavigate();
  const [cargas, setCargas] = useState<CombustibleCarroResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [borrador, setBorrador] = useState<FiltrosCarro>(filtrosVacios);
  const [aplicados, setAplicados] = useState<FiltrosCarro>(filtrosVacios);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        setCargas(await combustibleCarroService.listar());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el listado');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const set = (campo: keyof FiltrosCarro, valor: string) =>
    setBorrador((prev) => ({ ...prev, [campo]: valor }));

  const limpiar = () => {
    setBorrador(filtrosVacios);
    setAplicados(filtrosVacios);
  };

  const filtradas = cargas.filter((c) => {
    const f = aplicados;
    if (f.desde && c.fecha_carga < f.desde) return false;
    if (f.hasta && c.fecha_carga > f.hasta) return false;
    if (!contiene(c.maquina, f.maquina)) return false;
    if (!contiene(c.chofer, f.chofer)) return false;
    if (!contiene(c.estacion_servicio, f.estacion)) return false;
    if (!contiene(c.despachante, f.despachante)) return false;
    if (!contiene(c.tipo_combustible, f.tipo)) return false;
    if (f.parcialMin !== '' && c.estado_parcial < Number(f.parcialMin)) return false;
    if (f.parcialMax !== '' && c.estado_parcial > Number(f.parcialMax)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-nowrap gap-3 mb-6 overflow-x-auto pb-1">
          <button onClick={() => navigate('/servicios/combustible-carro')} className={navInactive}>
            Carga de Combustible (Carro)
          </button>
          <button onClick={() => navigate('/servicios/combustible-carro/listado')} className={navActive}>
            Listado Cargas
          </button>
          <button onClick={() => navigate('/servicios/combustible-carro/historial')} className={navInactive}>
            Historial de carga de combustible
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-[var(--color-text-primary)] font-semibold mb-4">Filtros de búsqueda</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Fecha de carga (desde)</label>
              <input type="date" value={borrador.desde} onChange={(e) => set('desde', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Fecha de carga (hasta)</label>
              <input type="date" value={borrador.hasta} onChange={(e) => set('hasta', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Máquina</label>
              <input type="text" placeholder="Nombre o código" value={borrador.maquina} onChange={(e) => set('maquina', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Chofer</label>
              <input type="text" placeholder="Nombre del chofer" value={borrador.chofer} onChange={(e) => set('chofer', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Estación de servicio</label>
              <input type="text" placeholder="Nombre de la estación" value={borrador.estacion} onChange={(e) => set('estacion', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Despachante</label>
              <input type="text" placeholder="Nombre del despachante" value={borrador.despachante} onChange={(e) => set('despachante', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tipo de combustible</label>
              <input type="text" placeholder="Ej.: Diesel" value={borrador.tipo} onChange={(e) => set('tipo', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Estado parcial (rango)</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Mín" value={borrador.parcialMin} onChange={(e) => set('parcialMin', e.target.value)} className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm" />
                <input type="number" placeholder="Máx" value={borrador.parcialMax} onChange={(e) => set('parcialMax', e.target.value)} className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button onClick={limpiar} className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300 transition-colors duration-200 cursor-pointer">
              Limpiar filtros
            </button>
            <button onClick={() => setAplicados(borrador)} className="px-5 py-2 rounded-lg bg-[#0062e3] text-white text-sm font-semibold hover:bg-[#0054c2] transition-colors duration-200 cursor-pointer">
              Buscar
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="mt-6 bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
            Cargando listado...
          </div>
        ) : (
          <div className="mt-6 bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-[1700px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className={thCls}>Nº</th>
                  <th className={thCls}>Máquina</th>
                  <th className={thCls}>Fecha</th>
                  <th className={thCls}>Chofer</th>
                  <th className={thCls}>Estación</th>
                  <th className={thCls}>Despachante</th>
                  <th className={thCls}>Tipo combustible</th>
                  <th className={thCls}>Galpón Vial</th>
                  <th className={thCls}>Litros entrada</th>
                  <th className={thCls}>Litros salida</th>
                  <th className={thCls}>Total combustible</th>
                  <th className={thCls}>Estado parcial</th>
                  <th className={thCls}>Registrada por</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((c) => (
                  <tr key={c.id_carro} className="border-b border-gray-100 last:border-0">
                    <td className={tdCls}>{c.id_carro}</td>
                    <td className={tdCls}>{c.maquina}</td>
                    <td className={tdCls}>{c.fecha_carga}</td>
                    <td className={tdCls}>{c.chofer}</td>
                    <td className={tdCls}>{c.estacion_servicio}</td>
                    <td className={tdCls}>{c.despachante}</td>
                    <td className={tdCls}>{c.tipo_combustible}</td>
                    <td className={tdCls}>{c.galpon_vial || '—'}</td>
                    <td className={tdCls}>{c.litros_entrada}</td>
                    <td className={tdCls}>{c.litros_salida}</td>
                    <td className={tdCls}>{c.total_combustible}</td>
                    <td className={tdCls}>{c.estado_parcial}</td>
                    <td className={tdCls}>
                      {c.registrada_por_nombre} {c.registrada_por_apellido} (DNI {c.registrada_por_dni})
                    </td>
                  </tr>
                ))}
                {filtradas.length === 0 && (
                  <tr>
                    <td colSpan={13} className="px-3 py-6 text-center text-gray-400">
                      {cargas.length === 0
                        ? 'Todavía no hay cargas de combustible (Carro) registradas.'
                        : 'No se encontraron cargas con los filtros aplicados.'}
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

export default CarroListadoPage;
