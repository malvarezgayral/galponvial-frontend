import { useEffect, useState } from 'react';
import { useAdminPermissions } from '@/features/usuarios/hooks/useAdminPermissions';
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
  codigo: '',
  nombre_fantasia: '',
  numero: '',
  codigo_area: '',
  codigo_postal: '',
  cuit: '',
  estado: 'NORMAL',
};

type FiltrosProveedor = {
  rubro: string;
  nombre: string;
  codigo: string;
  nombre_fantasia: string;
  ciudad: string;
  cuit: string;
  estado: string;
};

const FILTROS_VACIOS: FiltrosProveedor = { rubro: '', nombre: '', codigo: '', nombre_fantasia: '', ciudad: '', cuit: '', estado: '' };

/** Filtros de texto de Visualizar, en el orden en que se muestran (Rubro va antes y Estado después). */
const FILTROS_TEXTO: Array<[keyof FiltrosProveedor, string]> = [
  ['nombre', 'Razón Social'],
  ['codigo', 'Código'],
  ['nombre_fantasia', 'Nombre de Fantasía'],
  ['ciudad', 'Ciudad'],
  ['cuit', 'CUIT'],
];

const CLASE_FILTRO = 'w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500';

/** Minúsculas y sin acentos, para que "loberia" encuentre "Lobería". */
const normalizar = (s?: string | null): string =>
  (s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const soloDigitos = (s?: string | null): string => (s ?? '').replace(/\D/g, '');

export default function ProveedoresPage() {
  const [vistaActiva, setVistaActiva] = useState<'visualizar' | 'nuevo' | 'eliminar' | 'editar'>('nuevo');
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [borradorFiltros, setBorradorFiltros] = useState<FiltrosProveedor>(FILTROS_VACIOS);
  const [filtros, setFiltros] = useState<FiltrosProveedor>(FILTROS_VACIOS);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateProveedorPayload>(formVacio);
  const [guardando, setGuardando] = useState(false);
  const [busquedaLimpia, setBusquedaLimpia] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const { isAdmin, isSuperAdmin } = useAdminPermissions();
  const esSuperadmin = isSuperAdmin();
  const esAdmin = isAdmin();
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formEdicion, setFormEdicion] = useState<CreateProveedorPayload>(formVacio);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

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
    if (vistaActiva === 'visualizar' || vistaActiva === 'eliminar' || vistaActiva === 'editar') {
      cargarProveedores();
    }
  }, [vistaActiva]);

  const gruposDisponibles = Array.from(
    new Set(proveedores.map((p) => p.rubro).filter((r): r is string => Boolean(r)))
  );

  const proveedoresFiltrados = proveedores.filter((p) =>
    (filtros.rubro === '' || p.rubro === filtros.rubro) &&
    (filtros.estado === '' || p.estado === filtros.estado) &&
    normalizar(p.nombre).includes(normalizar(filtros.nombre)) &&
    normalizar(p.codigo).includes(normalizar(filtros.codigo)) &&
    normalizar(p.nombre_fantasia).includes(normalizar(filtros.nombre_fantasia)) &&
    normalizar(p.ciudad).includes(normalizar(filtros.ciudad)) &&
    soloDigitos(p.cuit).includes(soloDigitos(filtros.cuit))
  );

  const handleEliminar = async (p: Proveedor) => {
    if (!window.confirm('¿Eliminar el proveedor "' + p.nombre + '"? Esta acción no se puede deshacer.')) return;
    try {
      setEliminandoId(p.id);
      setError('');
      await proveedoresService.remove(p.id);
      setProveedores((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(' ') : msg || 'No se pudo eliminar el proveedor.');
      console.error(err);
    } finally {
      setEliminandoId(null);
    }
  };

  const abrirEdicion = (p: Proveedor) => {
    setError('');
    setEditandoId(p.id);
    setFormEdicion({
      nombre: p.nombre || '',
      telefono: p.telefono || '',
      direccion: p.direccion || '',
      horarios: p.horarios || '',
      ciudad: p.ciudad || '',
      rubro: p.rubro || '',
      codigo: p.codigo || '',
      nombre_fantasia: p.nombre_fantasia || '',
      numero: p.numero || '',
      codigo_area: p.codigo_area || '',
      codigo_postal: p.codigo_postal || '',
      cuit: p.cuit || '',
      estado: p.estado || 'NORMAL',
    });
  };

  const handleEdicionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormEdicion((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editandoId === null) return;
    try {
      setGuardandoEdicion(true);
      setError('');
      const actualizado = await proveedoresService.update(editandoId, formEdicion);
      setProveedores((prev) => prev.map((x) => (x.id === editandoId ? { ...x, ...formEdicion, ...(actualizado || {}) } : x)));
      setEditandoId(null);
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(' ') : msg || 'No se pudo guardar el proveedor.');
      console.error(err);
    } finally {
      setGuardandoEdicion(false);
    }
  };

  const proveedoresOrdenados = [...proveedores].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
  );

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      alert(Array.isArray(msg) ? msg.join('\n') : msg || 'No se pudo registrar el proveedor.');
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
            onClick={() => setVistaActiva('nuevo')}
            style={{ backgroundColor: '#0062e3' }}
            className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90"
          >
            Nuevo Proveedor
          </button>

          <button
            onClick={() => setVistaActiva('visualizar')}
            style={{ backgroundColor: '#0062e3' }}
            className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90"
          >
            Visualizar Proveedor
          </button>
          {esAdmin && (
            <button
              onClick={() => { setEditandoId(null); setError(''); setVistaActiva('editar'); }}
              style={{ backgroundColor: '#0062e3' }}
              className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90"
            >
              Editar Proveedor
            </button>
          )}
          {(
            <button
              onClick={() => setVistaActiva('eliminar')}
              style={{ backgroundColor: '#0062e3' }}
              className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90"
            >
              Eliminar Proveedor
            </button>
          )}
        </div>
      </div>

      {vistaActiva === 'visualizar' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <form
              onSubmit={(e) => { e.preventDefault(); setFiltros(borradorFiltros); setBusquedaLimpia(false); }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rubro</label>
                <select
                  value={borradorFiltros.rubro}
                  onChange={(e) => setBorradorFiltros({ ...borradorFiltros, rubro: e.target.value })}
                  className={CLASE_FILTRO}
                >
                  <option value="">Todos</option>
                  {gruposDisponibles.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              {FILTROS_TEXTO.map(([campo, etiqueta]) => (
                <div key={campo}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{etiqueta}</label>
                  <input
                    type="text"
                    value={borradorFiltros[campo]}
                    onChange={(e) => setBorradorFiltros({ ...borradorFiltros, [campo]: e.target.value })}
                    placeholder="Contiene…"
                    className={CLASE_FILTRO}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={borradorFiltros.estado}
                  onChange={(e) => setBorradorFiltros({ ...borradorFiltros, estado: e.target.value })}
                  className={CLASE_FILTRO}
                >
                  <option value="">Todos</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="FUERA DE ESTADO">FUERA DE ESTADO</option>
                </select>
              </div>
              <div className="flex items-end gap-3">
                <button
                  type="button"
                  onClick={() => { setBorradorFiltros(FILTROS_VACIOS); setFiltros(FILTROS_VACIOS); setBusquedaLimpia(true); }}
                  className="flex-1 px-4 py-2 rounded font-medium text-white bg-gray-500 hover:bg-gray-600 transition-colors"
                >
                  Limpiar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#0062e3' }}
                  className="flex-1 px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90"
                >
                  Buscar
                </button>
              </div>
            </form>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Código</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Razón Social</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Nombre de Fantasía</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Teléfono</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Dirección</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">N°</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">C.P.</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Ciudad</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Rubro</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Horarios</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">CUIT</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cargando && (
                    <tr>
                      <td colSpan={12} className="px-3 py-6 text-center text-gray-400">
                        Cargando proveedores...
                      </td>
                    </tr>
                  )}
                  {!cargando && busquedaLimpia && (
                    <tr>
                      <td colSpan={12} className="px-3 py-6 text-center text-gray-400">
                        Búsqueda limpia. Completá los filtros que quieras y tocá Buscar para ver los proveedores.
                      </td>
                    </tr>
                  )}
                  {!cargando && !busquedaLimpia && proveedoresFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={12} className="px-3 py-6 text-center text-gray-400">
                        {proveedores.length === 0 ? 'No hay proveedores cargados.' : 'Ningún proveedor coincide con los filtros.'}
                      </td>
                    </tr>
                  )}
                  {!cargando && !busquedaLimpia && proveedoresFiltrados.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{p.codigo || '-'}</td>
                      <td className="px-3 py-2">{p.nombre}</td>
                      <td className="px-3 py-2">{p.nombre_fantasia || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{p.telefono ? (p.codigo_area ? '(' + p.codigo_area + ') ' : '') + p.telefono : '-'}</td>
                      <td className="px-3 py-2">{p.direccion || '-'}</td>
                      <td className="px-3 py-2">{p.numero || '-'}</td>
                      <td className="px-3 py-2">{p.codigo_postal || '-'}</td>
                      <td className="px-3 py-2">{p.ciudad || '-'}</td>
                      <td className="px-3 py-2">{p.rubro || '-'}</td>
                      <td className="px-3 py-2">{p.horarios || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{p.cuit || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{p.estado || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {vistaActiva === 'eliminar' && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Eliminar Proveedor</h2>
          <p className="text-sm text-gray-600">
            Solo se pueden eliminar proveedores sin órdenes de compra, suministros ni presupuestos asociados.
          </p>
          {!esSuperadmin && (
            <p className="text-sm font-medium text-amber-700">Solo el superadministrador puede eliminar proveedores.</p>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Razón Social</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Rubro</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Ciudad</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cargando && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-gray-400">Cargando proveedores...</td>
                  </tr>
                )}
                {!cargando && proveedoresOrdenados.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-gray-400">No hay proveedores cargados.</td>
                  </tr>
                )}
                {!cargando && proveedoresOrdenados.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{p.nombre}</td>
                    <td className="px-3 py-2">{p.rubro || '-'}</td>
                    <td className="px-3 py-2">{p.ciudad || '-'}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => handleEliminar(p)}
                        disabled={eliminandoId !== null || !esSuperadmin}
                        className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {eliminandoId === p.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {vistaActiva === 'editar' && esAdmin && editandoId === null && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Editar Proveedor</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Razón Social</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Rubro</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Ciudad</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cargando && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-gray-400">Cargando proveedores...</td>
                  </tr>
                )}
                {!cargando && proveedoresOrdenados.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-gray-400">No hay proveedores cargados.</td>
                  </tr>
                )}
                {!cargando && proveedoresOrdenados.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{p.nombre}</td>
                    <td className="px-3 py-2">{p.rubro || '-'}</td>
                    <td className="px-3 py-2">{p.ciudad || '-'}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => abrirEdicion(p)}
                        style={{ backgroundColor: '#0062e3' }}
                        className="px-3 py-1 rounded text-white transition-colors hover:opacity-90"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {vistaActiva === 'editar' && esAdmin && editandoId !== null && (
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Proveedor</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleGuardarEdicion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
              <input
                type="text"
                name="codigo"
                value={formEdicion.codigo ?? ''}
                onChange={handleEdicionChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social *</label>
              <input
                type="text"
                name="nombre"
                value={formEdicion.nombre ?? ''}
                onChange={handleEdicionChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Fantasía *</label>
              <input
                type="text"
                name="nombre_fantasia"
                value={formEdicion.nombre_fantasia ?? ''}
                onChange={handleEdicionChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
              <input
                type="text"
                name="telefono"
                value={formEdicion.telefono ?? ''}
                onChange={handleEdicionChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
              <input
                type="text"
                name="direccion"
                value={formEdicion.direccion ?? ''}
                onChange={handleEdicionChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N° *</label>
              <input
                type="text"
                name="numero"
                value={formEdicion.numero ?? ''}
                onChange={handleEdicionChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código de Área *</label>
              <input
                type="text"
                name="codigo_area"
                value={formEdicion.codigo_area ?? ''}
                onChange={handleEdicionChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">C.P. *</label>
              <input
                type="text"
                name="codigo_postal"
                value={formEdicion.codigo_postal ?? ''}
                onChange={handleEdicionChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CUIT *</label>
              <input
                type="text"
                name="cuit"
                value={formEdicion.cuit ?? ''}
                onChange={handleEdicionChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
              <select
                name="estado"
                value={formEdicion.estado ?? 'NORMAL'}
                onChange={handleEdicionChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NORMAL">NORMAL</option>
                <option value="FUERA DE ESTADO">FUERA DE ESTADO</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horarios *</label>
              <input
                type="text"
                name="horarios"
                value={formEdicion.horarios ?? ''}
                onChange={handleEdicionChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
              <input
                type="text"
                name="ciudad"
                value={formEdicion.ciudad ?? ''}
                onChange={handleEdicionChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rubro *</label>
              <input
                type="text"
                name="rubro"
                value={formEdicion.rubro ?? ''}
                onChange={handleEdicionChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={guardandoEdicion}
                className="flex-1 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors disabled:opacity-50"
              >
                {guardandoEdicion ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                type="button"
                onClick={() => { setEditandoId(null); setError(''); }}
                className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {vistaActiva === 'nuevo' && (
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Proveedor</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo ?? ''}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre ?? ''}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Fantasía *</label>
              <input
                type="text"
                name="nombre_fantasia"
                value={formData.nombre_fantasia ?? ''}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono ?? ''}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion ?? ''}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N° *</label>
              <input
                type="text"
                name="numero"
                value={formData.numero ?? ''}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código de Área *</label>
              <input
                type="text"
                name="codigo_area"
                value={formData.codigo_area ?? ''}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">C.P. *</label>
              <input
                type="text"
                name="codigo_postal"
                value={formData.codigo_postal ?? ''}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CUIT *</label>
              <input
                type="text"
                name="cuit"
                value={formData.cuit ?? ''}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
              <select
                name="estado"
                value={formData.estado ?? 'NORMAL'}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NORMAL">NORMAL</option>
                <option value="FUERA DE ESTADO">FUERA DE ESTADO</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horarios *</label>
              <input
                type="text"
                name="horarios"
                value={formData.horarios ?? ''}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad ?? ''}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rubro *</label>
              <input
                type="text"
                name="rubro"
                value={formData.rubro ?? ''}
                onChange={handleFormChange}
                required
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
