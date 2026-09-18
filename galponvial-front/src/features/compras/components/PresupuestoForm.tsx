import React, { useEffect, useState } from 'react';
import { proveedoresService, type Proveedor } from '../../proveedores/services/proveedoresService';
import { presupuestoService, type CreatePresupuestoPayload } from '../services/presupuestoService';

interface PresupuestoFormProps {
  numero: 1 | 2 | 3;
  onCreado?: () => void;
}

const formVacio = (todayString: string): CreatePresupuestoPayload => ({
  id_proveedor: undefined,
  producto: '',
  precio: 0,
  unidad: '',
  areaMunicipio: '',
  fechaSolicitud: todayString,
  fechaEntrega: '',
  observaciones: '',
});

export const PresupuestoForm: React.FC<PresupuestoFormProps> = ({ numero, onCreado }) => {
  const todayString = new Date().toISOString().split('T')[0];

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [formData, setFormData] = useState<CreatePresupuestoPayload>(formVacio(todayString));
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    proveedoresService.getAll().then(setProveedores).catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'precio' ? Number(value) : name === 'id_proveedor' ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGuardando(true);
      await presupuestoService.create(formData);
      setFormData(formVacio(todayString));
      onCreado?.();
      alert(`Presupuesto ${numero} registrado correctamente.`);
    } catch (err) {
      alert('No se pudo registrar el presupuesto.');
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  const handleReset = () => {
    setFormData(formVacio(todayString));
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        Presupuesto {numero}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Proveedor</label>
          <select
            name="id_proveedor"
            value={formData.id_proveedor ?? ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#378AFE]"
          >
            <option value="">— Sin proveedor asignado —</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Producto *</label>
          <input type="text" name="producto" value={formData.producto} onChange={handleChange} placeholder="Ingrese el nombre del producto" required className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Precio *</label>
          <input type="number" name="precio" value={formData.precio || ''} onChange={handleChange} placeholder="0.00" min="0" step="0.01" required className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Unidad *</label>
          <select name="unidad" value={formData.unidad} onChange={handleChange} required className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#378AFE]">
            <option value="">Seleccione una unidad...</option>
            <option value="Oficina">Oficina</option>
            <option value="Taller 1">Taller 1</option>
            <option value="Taller 2">Taller 2</option>
            <option value="Taller 3">Taller 3</option>
            <option value="Depo Combustible y Lubricantes">Depo Combustible y Lubricantes</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Área del Municipio *</label>
          <input type="text" name="areaMunicipio" value={formData.areaMunicipio} onChange={handleChange} placeholder="Ingrese el área del municipio" required className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Fecha de Solicitud de Presupuesto *</label>
          <input type="date" name="fechaSolicitud" value={formData.fechaSolicitud} max={todayString} onChange={handleChange} required className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Fecha de Entrega *</label>
          <input type="date" name="fechaEntrega" value={formData.fechaEntrega} onChange={handleChange} required className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Observaciones</label>
          <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} placeholder="Ingrese observaciones adicionales..." rows={4} className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE] resize-none" />
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={guardando} className="flex-1 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors duration-200 cursor-pointer disabled:opacity-50">
            {guardando ? 'Guardando...' : 'Registrar Presupuesto'}
          </button>
          <button type="button" onClick={handleReset} className="flex-1 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer">Limpiar</button>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">* Campos obligatorios</p>
      </form>
    </div>
  );
};
