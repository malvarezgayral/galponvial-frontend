import React, { useState } from 'react';

interface PresupuestoFormProps {
  numero: 1 | 2 | 3;
}

export const PresupuestoForm: React.FC<PresupuestoFormProps> = ({ numero }) => {
  const todayString = new Date().toISOString().split('T')[0];

  const [mostrarProveedores, setMostrarProveedores] = useState(false);
  const [formData, setFormData] = useState({
    producto: '',
    precio: '',
    unidad: '',
    areaMunicipio: '',
    fechaSolicitud: todayString,
    fechaEntrega: '',
    observaciones: '',
  });
  const [archivo, setArchivo] = useState<File | null>(null);
  const [archivoError, setArchivoError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setArchivoError('');
    if (file) {
      const tiposPermitidos = [
        'image/jpeg', 'image/png', 'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!tiposPermitidos.includes(file.type)) {
        setArchivoError('Solo se permiten imágenes, PDF o Word.');
        setArchivo(null);
        return;
      }
    }
    setArchivo(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Presupuesto ${numero} enviado (sin conexión al backend por ahora)`);
  };

  const handleReset = () => {
    setFormData({ producto: '', precio: '', unidad: '', areaMunicipio: '', fechaSolicitud: todayString, fechaEntrega: '', observaciones: '' });
    setArchivo(null);
    setArchivoError('');
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        Presupuesto {numero}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <button type="button" onClick={() => setMostrarProveedores((prev) => !prev)} className="w-full px-4 py-3 bg-gray-100 text-[var(--color-text-primary)] font-medium rounded-lg border border-[var(--color-border-light)] hover:bg-gray-200 transition-colors duration-200 flex items-center justify-between">
            <span>Proveedor</span>
            <span className="text-gray-500 text-sm">{mostrarProveedores ? '▲ Cerrar' : '▼ Ver proveedores'}</span>
          </button>
          {mostrarProveedores && (
            <div className="mt-2 p-4 border border-[var(--color-border-light)] rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500 italic">Los proveedores se cargarán próximamente.</p>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Producto *</label>
          <input type="text" name="producto" value={formData.producto} onChange={handleChange} placeholder="Ingrese el nombre del producto" required className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Precio *</label>
          <input type="number" name="precio" value={formData.precio} onChange={handleChange} placeholder="0.00" min="0" step="0.01" required className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE]" />
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
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Archivo <span className="text-gray-500 font-normal">(imagen, PDF o Word)</span></label>
          <div className="w-full px-4 py-4 border-2 border-dashed border-[var(--color-border-light)] rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleArchivoChange} className="w-full text-sm text-gray-600 cursor-pointer" />
            <p className="text-xs text-gray-400 mt-2">Formatos permitidos: JPG, PNG, WEBP, PDF, DOC, DOCX</p>
          </div>
          {archivoError && <p className="text-red-500 text-sm mt-1">{archivoError}</p>}
          {archivo && !archivoError && <p className="text-green-600 text-sm mt-1">Archivo seleccionado: {archivo.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Observaciones</label>
          <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} placeholder="Ingrese observaciones adicionales..." rows={4} className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE] resize-none" />
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors duration-200 cursor-pointer">Registrar Presupuesto</button>
          <button type="button" onClick={handleReset} className="flex-1 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer">Limpiar</button>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">* Campos obligatorios</p>
      </form>
    </div>
  );
};
