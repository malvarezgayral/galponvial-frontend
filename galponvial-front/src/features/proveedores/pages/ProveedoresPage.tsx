import { CompraDirectaForm } from '../components/CompraDirectaForm';

export default function ProveedoresPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Proveedores</h1>
        <p className="text-[var(--color-text-secondary)]">
          Gestión de compras y proveedores del Galpón Vial
        </p>
      </div>
      <CompraDirectaForm />
    </div>
  );
}
