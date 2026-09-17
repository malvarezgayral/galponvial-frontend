import { useEffect, useState } from 'react';
import { InfoProveedorForm } from '../components/InfoProveedorForm';
import {
  proveedoresService,
  type Proveedor,
  type CreateProveedorPayload,
} from '../services/proveedoresService';

const formVacio: CreateProveedorPayload = {
  nombre: '',
  telefono: '',
  direccion: '',
  horarios: '',
  ciudad: '',
  rubro: '',
};

export default function ProveedoresPage() {
  const [vistaActiva, setVistaActiva] = useState<'visualizar' | 'info' | 'nuevo'>('visualizar');
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [filtroGrupo, setFiltroGrupo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateProveedorPayload>(formVacio);
  const [guardando, setGuardando] = useState(false);

  const cargarProveedores = async () => {
    try {
      setCargando(true);
      setError('');
      const data = await proveedoresService.getAll();
      setProveedores(data);
    } catch (err) {
      setError('No se pudieron cargar los proveedores.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (vistaActiva === 'visualizar') {
      cargarProveedores();
    }
  }, [vistaActiva]);

  const gruposDisponibles = Array.from(
    new Set(proveedores.map((p) => p.rubro).filter((r): r is string => Boolean(r)))
  );

  const proveedoresFiltrados = filtroGrupo
    ? proveedores.filter((p) => p.rubro === filtroGrupo)
    : proveedores;

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGuardando(true);
      await proveedoresService.create(formData);
      setFormData(formVacio);
      setVistaActiva('visualizar');
    } catch (err) {
      alert('No se pudo registrar el proveedor.');
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Proveedores</h1>
        <div className="flex flex-row gap-3">
          <button
            onClick={() => setVistaActiva('visualizar')}
            style={{ backgroundColor: '#0062e3' }}
            className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90"
          >
            Visualizar Proveedores
          </button>

          <button
            onClick={() => setVistaActiva('info')}
            style={{ backgroundColor: '#0062e3' }}
            className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90"
          >
            Info del Proveedor
          </button>

          <button
            onClick={() => setVistaActiva('nuevo')}
            style={{ backgroundColor: '#0062e3' }}
            className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90"
          >
            + Nuevo Proveedor
          </button>
        </div>
      </div>

      {vistaActiva === 'visualizar' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por rubro
              </label>
              <select
                value={filtroGrupo}
                onChange={(e) => setFiltroGrupo(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los rubros</option>
                {gruposDisponibles.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Nombre</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Teléfono</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Dirección</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Ciudad</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Rubro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cargando && (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-gray-400">
                        Cargando proveedores...
                      </td>
                    </tr>
                  )}
                  {!cargando && proveedoresFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-gray-400">
                        No hay proveedores cargados.
                      </td>
                    </tr>
                  )}
                  {!cargando && proveedoresFiltrados.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{p.nombre}</td>
                      <td className="px-3 py-2">{p.telefono || '-'}</td>
                      <td className="px-3 py-2">{p.direccion || '-'}</td>
                      <td className="px-3 py-2">{p.ciudad || '-'}</td>
                      <td className="px-3 py-2">{p.rubro || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {vistaActiva === 'info' && (
        <InfoProveedorForm />
      )}

      {vistaActiva === 'nuevo' && (
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Proveedor</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horarios</label>
              <input
                type="text"
                name="horarios"
                value={formData.horarios}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rubro</label>
              <input
                type="text"
                name="rubro"
                value={formData.rubro}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={guardando}
              className="w-full px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : 'Registrar Proveedor'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
