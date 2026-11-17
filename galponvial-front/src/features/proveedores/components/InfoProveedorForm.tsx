import React, { useEffect, useState } from 'react';
import { proveedoresService, type Proveedor } from '../services/proveedoresService';

export const InfoProveedorForm: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [seleccionado, setSeleccionado] = useState<Proveedor | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        setCargando(true);
        const data = await proveedoresService.getAll();
        setProveedores(data);
      } catch (err) {
        setError('No se pudieron cargar los proveedores.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargarProveedores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nombre = e.target.value;
    const proveedor = proveedores.find((p) => p.nombre === nombre) || null;
    setSeleccionado(proveedor);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Info del Proveedor</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
        <select
          onChange={handleChange}
          defaultValue=""
          disabled={cargando}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE] bg-white"
        >
          <option value="">
            {cargando ? 'Cargando proveedores...' : '-- Seleccionar proveedor --'}
          </option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.nombre}>{p.nombre}</option>
          ))}
        </select>
      </div>

      {seleccionado ? (
        <div className="space-y-4">
          <div>
            <span className="block text-sm font-medium text-gray-500">Código</span>
            <span className="block text-base text-gray-900">{seleccionado.codigo || '-'}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Nombre de Fantasía</span>
            <span className="block text-base text-gray-900">{seleccionado.nombre_fantasia || '-'}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Teléfono</span>
            <span className="block text-base text-gray-900">{seleccionado.telefono || '-'}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Dirección</span>
            <span className="block text-base text-gray-900">{seleccionado.direccion || '-'}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">N°</span>
            <span className="block text-base text-gray-900">{seleccionado.numero || '-'}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Código de Área</span>
            <span className="block text-base text-gray-900">{seleccionado.codigo_area || '-'}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">C.P.</span>
            <span className="block text-base text-gray-900">{seleccionado.codigo_postal || '-'}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">CUIT</span>
            <span className="block text-base text-gray-900">{seleccionado.cuit || '-'}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Estado</span>
            <span className="block text-base text-gray-900">{seleccionado.estado || '-'}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Horarios</span>
            <span className="block text-base text-gray-900">{seleccionado.horarios || '-'}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Ciudad</span>
            <span className="block text-base text-gray-900">{seleccionado.ciudad || '-'}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Rubro</span>
            <span className="block text-base text-gray-900">{seleccionado.rubro || '-'}</span>
          </div>
        </div>
      ) : (
        <div className="text-gray-400 italic text-sm">
          Seleccioná un proveedor para ver su información.
        </div>
      )}
    </div>
  );
};
