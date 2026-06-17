import React, { useState } from 'react';

interface Proveedor {
  nombre: string;
  telefono: string;
  direccion: string;
  horarios: string;
  ciudad: string;
  rubro: string;
}

const PROVEEDORES: Proveedor[] = [];

export const InfoProveedorForm: React.FC = () => {
  const [seleccionado, setSeleccionado] = useState<Proveedor | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nombre = e.target.value;
    const proveedor = PROVEEDORES.find((p) => p.nombre === nombre) || null;
    setSeleccionado(proveedor);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Info del Proveedor</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
        <select
          onChange={handleChange}
          defaultValue=""
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE] bg-white"
        >
          <option value="">-- Seleccionar proveedor --</option>
          {PROVEEDORES.map((p) => (
            <option key={p.nombre} value={p.nombre}>{p.nombre}</option>
          ))}
        </select>
      </div>

      {seleccionado ? (
        <div className="space-y-4">
          <div>
            <span className="block text-sm font-medium text-gray-500">Teléfono</span>
            <span className="block text-base text-gray-900">{seleccionado.telefono}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Dirección</span>
            <span className="block text-base text-gray-900">{seleccionado.direccion}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Horarios</span>
            <span className="block text-base text-gray-900">{seleccionado.horarios}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Ciudad</span>
            <span className="block text-base text-gray-900">{seleccionado.ciudad}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Rubro</span>
            <span className="block text-base text-gray-900">{seleccionado.rubro}</span>
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
