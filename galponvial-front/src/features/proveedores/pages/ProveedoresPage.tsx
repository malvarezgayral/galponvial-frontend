import { useState } from 'react';
import { PresupuestoForm } from '../components/PresupuestoForm';
import { InfoProveedorForm } from '../components/InfoProveedorForm';

export default function ProveedoresPage() {
  const [vistaActiva, setVistaActiva] = useState<'compras' | 'visualizar' | 'historial' | 'info'>('compras');

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Proveedores</h1>
        <div className="flex flex-row gap-3">
          <button
            onClick={() => setVistaActiva('compras')}
            style={{ backgroundColor: '#0062e3' }}
            className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90"
          >
            Presupuestos
          </button>
          <button
            onClick={() => setVistaActiva('visualizar')}
            style={{ backgroundColor: '#0062e3' }}
            className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90"
          >
            Visualizar Proveedores
          </button>
          <button
            onClick={() => setVistaActiva('historial')}
            style={{ backgroundColor: '#0062e3' }}
            className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90"
          >
            Historial de Presupuestos
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

      {vistaActiva === 'compras' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-6 items-start">
            <PresupuestoForm numero={1} />
            <PresupuestoForm numero={2} />
          </div>
          <div className="flex flex-row gap-6 items-start">
            <PresupuestoForm numero={3} />
          </div>
        </div>
      )}

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

      {vistaActiva === 'historial' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial de Presupuestos</h2>
            <div className="space-y-4">
              {[2026, 2025, 2024].map((anio) => (
                <div key={anio}>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">{anio}</h3>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                    {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'].map((mes) => (
                      <button
                        key={mes}
                        className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:border-blue-400 transition-colors"
                      >
                        {mes}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
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
