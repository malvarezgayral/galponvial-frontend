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
            Historial
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
        <div className="text-gray-500 italic">
          Visualizar Proveedores — próximamente.
        </div>
      )}

      {vistaActiva === 'historial' && (
        <div className="text-gray-500 italic">
          Historial — próximamente.
        </div>
      )}

      {vistaActiva === 'info' && (
        <InfoProveedorForm />
      )}
    </div>
  );
}
