import React, { useState, useEffect } from 'react';
import { useAlmacenStore } from '../store';
import type { Grupo } from '../types';

interface EditGrupoModalProps {
  isOpen: boolean;
  grupo: Grupo | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditGrupoModal: React.FC<EditGrupoModalProps> = ({ isOpen, grupo, onClose, onSuccess }) => {
  const { updateGrupo, sectores, fetchSectores } = useAlmacenStore();
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', sector_id: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
        fetchSectores();
    }
    if (grupo) {
      setFormData({
        nombre: grupo.nombre,
        descripcion: grupo.descripcion,
        sector_id: grupo.sector?.id || 0
      });
    }
  }, [fetchSectores, grupo, isOpen]);

  if (!isOpen || !grupo) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateGrupo(grupo.id, formData);
      onSuccess();
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden">
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Editar Grupo: {grupo.nombre}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
            <select
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.sector_id}
                onChange={(e) => setFormData({...formData, sector_id: Number(e.target.value)})}
            >
                <option value={0}>Seleccione Sector</option>
                {sectores.map(s => (
                    <option key={s.id} value={s.id}>{s.descripcion} ({s.nro_sector})</option>
                ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};