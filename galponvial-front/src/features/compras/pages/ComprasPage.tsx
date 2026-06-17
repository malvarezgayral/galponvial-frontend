import { CompraDirectaForm } from '../../proveedores/components/CompraDirectaForm';

const ComprasPage = () => {
  return (
    <div className="p-6">
      <div className="flex flex-row gap-3 mb-6">
        <button
          style={{ backgroundColor: '#0062e3' }}
          className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90"
        >
          Compra directa
        </button>
      </div>
      <CompraDirectaForm />
    </div>
  );
};

export default ComprasPage;
