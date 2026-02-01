import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { almacenService } from '../services/almacenService';

type MovimientoTipo = 'entrada' | 'salida';

interface CreateMovimientoModalProps {
  codArticulo: number;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateMovimientoModal: React.FC<CreateMovimientoModalProps> = ({
  codArticulo,
  onClose,
  onSuccess,
}) => {
  const [tipoMovimiento, setTipoMovimiento] = useState<MovimientoTipo | ''>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!tipoMovimiento) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        cod_articulo: codArticulo,
      };

      await almacenService.createMovimiento(payload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al crear movimiento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Registrar movimiento
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de movimiento
          </label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={tipoMovimiento}
            onChange={(e) =>
              setTipoMovimiento(e.target.value as MovimientoTipo)
            }
          >
            <option value="">Seleccionar</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>

        {tipoMovimiento === 'entrada' && (
          <div className="space-y-3">
            <select
              name="tipo"
              className="w-full border rounded-md px-3 py-2"
              onChange={handleChange}
            >
              <option value="">Tipo de entrada</option>
              <option value="compra">Compra</option>
              <option value="inventario inicial">Inventario inicial</option>
              <option value="cambio">Cambio</option>
              <option value="traspaso">Traspaso</option>
              <option value="cambio de unidad">Cambio de unidad</option>
              <option value="alquiler">Alquiler</option>
            </select>

            <input
              name="proveedor"
              placeholder="Proveedor"
              className="w-full border rounded-md px-3 py-2"
              onChange={handleChange}
            />

            <textarea
              name="detalle"
              placeholder="Detalle"
              className="w-full border rounded-md px-3 py-2"
              onChange={handleChange}
            />
          </div>
        )}

        {tipoMovimiento === 'salida' && (
          <div className="space-y-3">
            <select
              name="tipo"
              className="w-full border rounded-md px-3 py-2"
              onChange={handleChange}
            >
              <option value="">Tipo de salida</option>
              <option value="rotura">Rotura</option>
              <option value="perdida">Pérdida</option>
              <option value="consumo">Consumo</option>
              <option value="robo">Robo</option>
              <option value="devolucion">Devolución</option>
            </select>

            <input
              name="motivo_salida"
              placeholder="Motivo de salida"
              className="w-full border rounded-md px-3 py-2"
              onChange={handleChange}
            />

            <input
              name="detalle_motivo"
              placeholder="Detalle del motivo"
              className="w-full border rounded-md px-3 py-2"
              onChange={handleChange}
            />

            <textarea
              name="detalle"
              placeholder="Detalle"
              className="w-full border rounded-md px-3 py-2"
              onChange={handleChange}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={loading || !tipoMovimiento}
            onClick={handleSubmit}
          >
            {loading ? 'Guardando...' : 'Registrar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateMovimientoModal;
