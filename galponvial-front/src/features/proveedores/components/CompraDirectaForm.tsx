import React, { useState } from 'react';

export const CompraDirectaForm: React.FC = () => {
  const todayString = new Date().toISOString().split('T')[0];
  const [mostrarComercios, setMostrarComercios] = useState(false);
  const [formData, setFormData] = useState({ comercio: '', producto: '', fecha: todayString, unidad: '', agente: '' });
  const [archivo, setArchivo] = useState<File | null>(null);
  const [archivoError, setArchivoError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setArchivoError('');
    if (file) {
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!tiposPermitidos.includes(file.type)) {
        setArchivoError('Solo se permiten imágenes (JPG, PNG, WEBP) o PDF.');
        setArchivo(null);
        return;
      }
    }
    setArchivo(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Formulario enviado (sin conexión al backend por ahora)');
  };

  const handleReset = () => {
    setFormData({ comercio: '', producto: '', fecha: todayString, unidad: '', agente: '' });
    setArchivo(null);
    setArchivoError('');
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Compra Directa</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <button type="button" onClick={() => setMostrarComercios((prev) => !prev)} className="w-full px-4 py-3 bg-gray-100 text-[var(--color-text-primary)] font-medium rounded-lg border border-[var(--color-border-light)] hover:bg-gray-200 transition-colors duration-200 flex items-center justify-between">
            <span>Comercios</span>
            <span className="text-gray-500 text-sm">{mostrarComercios ? '▲ Cerrar' : '▼ Ver comercios'}</span>
          </button>
          {mostrarComercios && (
            <div className="mt-2 p-4 border border-[var(--color-border-light)] rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500 italic">Los comercios se cargarán próximamente.</p>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Producto *</label>
          <input type="text" name="producto" value={formData.producto} onChange={handleChange} placeholder="Ingrese el nombre del producto" required className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Fecha *</label>
          <input type="date" name="fecha" value={formData.fecha} max={todayString} onChange={handleChange} required className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Unidad *</label>
          <input type="text" name="unidad" value={formData.unidad} onChange={handleChange} placeholder="Ej: litros, kg, unidades..." required className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Agente *</label>
          <input type="text" name="agente" value={formData.agente} onChange={handleChange} placeholder="Nombre del agente que recibió" required className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#378AFE]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Recibo del agente <span className="text-gray-500 font-normal">(imagen o PDF)</span></label>
          <div className="w-full px-4 py-4 border-2 border-dashed border-[var(--color-border-light)] rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={handleArchivoChange} className="w-full text-sm text-gray-600 cursor-pointer" />
            <p className="text-xs text-gray-400 mt-2">Formatos permitidos: JPG, PNG, WEBP, PDF</p>
          </div>
          {archivoError && <p className="text-red-500 text-sm mt-1">{archivoError}</p>}
          {archivo && !archivoError && <p className="text-green-600 text-sm mt-1">Archivo seleccionado: {archivo.name}</p>}
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors duration-200 cursor-pointer">Registrar Compra</button>
          <button type="button" onClick={handleReset} className="flex-1 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer">Limpiar</button>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">* Campos obligatorios</p>
      </form>
    </div>
  );
};
