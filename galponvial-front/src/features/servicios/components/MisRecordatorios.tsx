import React, { useState, useEffect } from 'react';
import { recordatorioService } from '../services/recordatorioService';
import { RecordatorioCard } from './RecordatorioCard';
import { EditRecordatorioModal } from './EditRecordatorioModal';
import { DeleteRecordatorioConfirmationModal } from './DeleteRecordatorioConfirmationModal';
import { useAppStore } from '@/app/stores/appStore';
import type { RecordatorioResponse } from '../types';

/**
 * Componente para mostrar los recordatorios del usuario actual
 * Permite editar, eliminar uno o todos los recordatorios
 */
export const MisRecordatorios: React.FC = () => {
  const { user } = useAppStore();
  const [recordatorios, setRecordatorios] = useState<RecordatorioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modales
  const [editingRecordatorio, setEditingRecordatorio] = useState<RecordatorioResponse | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [recordatorioToDelete, setRecordatorioToDelete] = useState<RecordatorioResponse | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  /**
   * Carga los recordatorios del usuario
   */
  const loadRecordatorios = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user || !user.dni) {
        setRecordatorios([]);
        return;
      }

      const data = await recordatorioService.obtenerHistorial(user.dni);
      setRecordatorios(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar recordatorios';
      setError(errorMessage);
      setRecordatorios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecordatorios();

    // Recargar cada 60 segundos para actualizar timers
    const interval = setInterval(loadRecordatorios, 60000);
    return () => clearInterval(interval);
  }, [user]);

  /**
   * Maneja la apertura del modal de edición
   */
  const handleEditClick = (recordatorio: RecordatorioResponse) => {
    setEditingRecordatorio(recordatorio);
    setShowEditModal(true);
  };

  /**
   * Maneja la actualización exitosa de un recordatorio
   */
  const handleEditSuccess = (updatedRecordatorio: RecordatorioResponse) => {
    setRecordatorios((prevs) =>
      prevs.map((r) => (r.id === updatedRecordatorio.id ? updatedRecordatorio : r))
    );
    setShowEditModal(false);
    setEditingRecordatorio(null);
  };

  /**
   * Maneja la apertura del modal de confirmación de borrado
   */
  const handleDeleteClick = (recordatorio: RecordatorioResponse) => {
    setRecordatorioToDelete(recordatorio);
    setShowDeleteModal(true);
  };

  /**
   * Maneja la eliminación de un recordatorio
   */
  const handleDeleteConfirm = async () => {
    if (!recordatorioToDelete) return;

    setLoadingAction(true);
    try {
      await recordatorioService.deleteRecordatorio(recordatorioToDelete.id);
      setRecordatorios((prevs) => prevs.filter((r) => r.id !== recordatorioToDelete.id));
      setShowDeleteModal(false);
      setRecordatorioToDelete(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar recordatorio';
      setError(errorMessage);
    } finally {
      setLoadingAction(false);
    }
  };

  /**
   * Maneja la eliminación de todos los recordatorios
   */
  const handleDeleteAllConfirm = async () => {
    if (!user || !user.dni) return;

    setLoadingAction(true);
    try {
      await recordatorioService.deleteAllRecordatorios(user.dni);
      setRecordatorios([]);
      setShowDeleteAllModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar recordatorios';
      setError(errorMessage);
    } finally {
      setLoadingAction(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Encabezado con botón de eliminar todos */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            📌 Mis Recordatorios
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Gestiona tus citas y recordatorios pendientes
          </p>
        </div>

        {/* Botón eliminar todos (solo si hay recordatorios) */}
        {!loading && recordatorios.length > 0 && (
          <button
            onClick={() => setShowDeleteAllModal(true)}
            className="
              px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg
              text-sm font-medium transition-colors duration-200
              flex items-center gap-2 cursor-pointer
            "
            type="button"
            title="Eliminar todos los recordatorios"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.356 5.12m0 0l-.858 3.5m.858-3.5H9.458m5.282-8.62a2.25 2.25 0 00-1.591-2.991m0 0A2.251 2.251 0 0010 2.25h4a2.25 2.25 0 012.25 2.25m-4.5 0a2.25 2.25 0 00-2.25 2.25m.165 12.97a1.968 1.968 0 011.966-1.968h2.736a1.968 1.968 0 011.967 1.968m-9.636-11.63A1.875 1.875 0 0110.5 7.5H7.5a1.875 1.875 0 00-1.865 2.12m9.636 11.63l.858-3.5m0 0l-.354-5.12m0 0h-8.464m8.464 0l-.025-.025m-8.439.025l.004.039m0 0h-.371"
              />
            </svg>
            Eliminar todos
          </button>
        )}
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#378AFE] rounded-full mb-4">
              <svg
                className="animate-spin h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="text-[var(--color-text-primary)]">Cargando recordatorios...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Sin recordatorios */}
      {!loading && recordatorios.length === 0 && !error && (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-[var(--color-text-secondary)] font-medium mb-2">
            No tienes recordatorios
          </p>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Crea uno nuevo en la sección de servicios
          </p>
        </div>
      )}

      {/* Grid de recordatorios */}
      {!loading && recordatorios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recordatorios.map((recordatorio) => (
            <RecordatorioCard
              key={recordatorio.id}
              recordatorio={recordatorio}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modal de edición */}
      <EditRecordatorioModal
        isOpen={showEditModal}
        recordatorio={editingRecordatorio}
        onClose={() => {
          setShowEditModal(false);
          setEditingRecordatorio(null);
        }}
        onSuccess={handleEditSuccess}
      />

      {/* Modal de confirmación de eliminación */}
      <DeleteRecordatorioConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setRecordatorioToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar recordatorio?"
        message={`¿Estás seguro que deseas eliminar el recordatorio "${recordatorioToDelete?.descripcion}"? Esta acción no se puede deshacer.`}
        loading={loadingAction}
      />

      {/* Modal de confirmación de eliminación de todos */}
      <DeleteRecordatorioConfirmationModal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        onConfirm={handleDeleteAllConfirm}
        title="¿Eliminar todos los recordatorios?"
        message={`¿Estás seguro que deseas eliminar todos tus ${recordatorios.length} recordatorios? Esta acción no se puede deshacer.`}
        loading={loadingAction}
      />
    </div>
  );
};
