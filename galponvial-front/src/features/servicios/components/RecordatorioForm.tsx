import React, { useState, useEffect } from 'react';
import { recordatorioService } from '../services/recordatorioService';
import { useUsuariosStore } from '@/features/usuarios/store';
import { RecordatorioSuccessModal } from './RecordatorioSuccessModal';
import { useAppStore } from '@/app/stores/appStore';
import type { RecordatorioRequest, RecordatorioResponse } from '../types';

interface RecordatorioFormProps {
  onSuccess?: (response: RecordatorioResponse) => void;
}

/**
 * Formulario para crear un recordatorio
 * Valida que la fecha sea futura
 */
export const RecordatorioForm: React.FC<RecordatorioFormProps> = ({
  onSuccess,
}) => {
  const { user } = useAppStore();
  const isAdmin = user && (user.rol === 'admin' || user.rol === 'super-admin');
  
  const [formData, setFormData] = useState<RecordatorioRequest>({
    fecha: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '),
    descripcion: '',
  });
  
  const [selectedUserDni, setSelectedUserDni] = useState<number | null>(null);

  // Get users from store
  const { usuarios, isLoading: usuariosLoading, fetchUsuarios } = useUsuariosStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<RecordatorioResponse | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  /**
   * Carga la lista de usuarios si el usuario actual es admin
   */
  useEffect(() => {
    if (isAdmin) {
      // Fetch usuarios from store
      fetchUsuarios();
    } else if (user) {
      // Si no es admin, establecer su propio DNI
      setSelectedUserDni(user.dni);
    }
  }, [isAdmin, user, fetchUsuarios]);

  /**
   * Establece el primer usuario cuando se cargan desde el store
   */
  useEffect(() => {
    if (isAdmin && usuarios.length > 0 && selectedUserDni === null) {
      setSelectedUserDni(usuarios[0].dni);
    }
  }, [usuarios, isAdmin, selectedUserDni]);

  /**
   * Obtiene la fecha mínima permitida (hoy + 1 día)
   */
  const getMinDate = (): string => {
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    return tomorrow.toISOString().slice(0, 16).replace('T', ' ');
  };

  /**
   * Valida que la fecha sea futura
   */
  const isFutureDate = (dateString: string): boolean => {
    // Convertir el formato "YYYY-MM-DD HH:MM" a Date
    const selectedDate = new Date(dateString.replace(' ', 'T'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today;
  };

  /**
   * Valida los datos del formulario
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (isAdmin && !selectedUserDni) {
      newErrors.usuario = 'Debe seleccionar un usuario';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha del recordatorio es obligatoria';
    } else if (!isFutureDate(formData.fecha)) {
      newErrors.fecha = 'La fecha del recordatorio debe ser en el futuro';
    }

    if (!formData.descripcion || formData.descripcion.trim() === '') {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja los cambios en los inputs
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Determinar el DNI del usuario
      const userDni = isAdmin ? selectedUserDni : user?.dni;
      
      if (!userDni) {
        setGeneralError('No se pudo determinar el usuario');
        return;
      }

      // Agregar :00 segundos al datetime antes de enviar
      const dataToSend = {
        ...formData,
        fecha: `${formData.fecha}:00`,
      };
      const response = await recordatorioService.crearRecordatorio(userDni, dataToSend);
      setSuccessData(response);
      setShowSuccessModal(true);

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al crear el recordatorio';
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpia el formulario
   */
  const handleReset = () => {
    setFormData({
      fecha: getMinDate(),
      descripcion: '',
    });
    setErrors({});
    setGeneralError(null);
  };

  /**
   * Maneja el cierre del modal de éxito
   */
  const handleModalClose = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
    handleReset();
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Error general */}
        {generalError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 font-medium">{generalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Usuario (solo para admins) */}
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Usuario *
              </label>
              {usuariosLoading ? (
                <div className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg bg-gray-50 text-gray-500">
                  Cargando usuarios...
                </div>
              ) : (
                <select
                  value={selectedUserDni || ''}
                  onChange={(e) => setSelectedUserDni(parseInt(e.target.value))}
                  className={`
                    w-full px-4 py-2 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#378AFE]
                    ${errors.usuario ? 'border-red-500' : 'border-[var(--color-border-light)]'}
                  `}
                >
                  <option value="">Seleccionar usuario</option>
                  {usuarios.map((usr) => (
                    <option key={usr.dni} value={usr.dni}>
                      {usr.nombre} {usr.apellido} ({usr.dni})
                    </option>
                  ))}
                </select>
              )}
              {errors.usuario && <p className="text-red-500 text-sm mt-1">{errors.usuario}</p>}
            </div>
          )}

          {/* Fecha y hora del recordatorio */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Fecha y hora del recordatorio *
            </label>
            <input
              type="datetime-local"
              name="fecha"
              value={formData.fecha.replace(' ', 'T')}
              onChange={(e) => {
                const dateValue = e.target.value.replace('T', ' ');
                setFormData((prev) => ({
                  ...prev,
                  fecha: dateValue,
                }));
              }}
              min={getMinDate().replace(' ', 'T')}
              className={`
                w-full px-4 py-2 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#378AFE]
                ${errors.fecha ? 'border-red-500' : 'border-[var(--color-border-light)]'}
              `}
            />
            {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>}
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              La fecha debe ser en el futuro (mínimo mañana)
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Descripción del recordatorio *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Ej: Vencimiento de VTV, Cambio de aceite, Revisión técnica..."
              rows={5}
              className={`
                w-full px-4 py-2 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#378AFE]
                resize-vertical
                ${errors.descripcion ? 'border-red-500' : 'border-[var(--color-border-light)]'}
              `}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
            )}
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              {formData.descripcion.length}/500 caracteres
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="
                flex-1 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg
                hover:bg-[#0962DE] disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200 cursor-pointer
              "
            >
              {loading ? 'Creando...' : 'Crear Recordatorio'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="
                flex-1 px-6 py-3 bg-gray-300 text-[var(--color-text-primary)] font-medium rounded-lg
                hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200 cursor-pointer
              "
            >
              Limpiar
            </button>
          </div>

          <p className="text-sm text-[var(--color-text-secondary)] mt-4">
            * Campos obligatorios
          </p>
        </form>
      </div>

      {/* Modal de éxito */}
      {showSuccessModal && successData && (
        <RecordatorioSuccessModal data={successData} onClose={handleModalClose} />
      )}
    </>
  );
};
