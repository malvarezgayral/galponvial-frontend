import { useState } from 'react';
import { InfoProveedorForm } from '../components/InfoProveedorForm';

export default function ProveedoresPage() {
  const [vistaActiva, setVistaActiva] = useState<'visualizar' | 'info'>('visualizar');

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
        </div>
      </div>



      {vistaActiva === 'visualizar' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            {/* Campo: Proveedores */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proveedores
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              >
                <option value="">— Lista de proveedores (próximamente) —</option>
              </select>
            </div>
            {/* Campo: Filtrar por grupo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por grupo
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              >
                <option value="">— Seleccioná un grupo (próximamente) —</option>
              </select>
            </div>
          </div>
        </div>
      )}



      {vistaActiva === 'info' && (
        <InfoProveedorForm />
      )}
    </div>
  );
}
