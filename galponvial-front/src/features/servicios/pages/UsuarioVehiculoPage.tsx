import React, { useState, useEffect } from 'react';
import { usuarioVehiculoService } from '../services/usuarioVehiculoService';
import type { UsuarioVehiculoRelacion, UsuarioVehiculoResponse } from '../types';
import { DetallesRelacionModal } from '../components/DetallesRelacionModal';
import { ConfirmarDesasignarModal } from '../components/ConfirmarDesasignarModal';
import { ConfirmarAsignarModal } from '../components/ConfirmarAsignarModal';
import { AsignarForm } from '../components/AsignarForm';
import { Button } from '@/shared/ui/Button';
import type { User } from '@/features/usuarios/types';

type FeedbackType = 'success' | 'error' | null;

interface FeedbackState {
  type: FeedbackType;
  message: string;
}

interface VehiculoOption {
  id_vehiculo: number;
  codigo: string;
  nombre: string;
}

interface AsignarState {
  vehiculo: VehiculoOption | null;
  usuario: User | null;
}

/**
 * Page for managing usuario-vehículo relationships
 * Shows a table with all relationships and allows viewing details, unassigning, and assigning new ones
 */
const UsuarioVehiculoPage: React.FC = () => {
  const [relaciones, setRelaciones] = useState<UsuarioVehiculoRelacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [selectedRelacion, setSelectedRelacion] = useState<UsuarioVehiculoRelacion | null>(null);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: null, message: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [relacionParaDesasignar, setRelacionParaDesasignar] =
    useState<UsuarioVehiculoRelacion | null>(null);
  const [desasignando, setDesasignando] = useState(false);
  const [showConfirmAsignarModal, setShowConfirmAsignarModal] = useState(false);
  const [asignando, setAsignando] = useState(false);
  const [asignarState, setAsignarState] = useState<AsignarState>({ vehiculo: null, usuario: null });

  // Fetch relaciones on mount and when page changes
  useEffect(() => {
    const fetchRelaciones = async () => {
      try {
        setLoading(true);
        setError(null);
        const response: UsuarioVehiculoResponse = await usuarioVehiculoService.getAll(
          currentPage,
          pageSize
        );
        setRelaciones(response.data.data);
        setTotalPages(Math.ceil(response.data.total / pageSize));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al cargar las relaciones usuario-vehículo';
        setError(message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelaciones();
  }, [currentPage, pageSize]);

  // Auto-hide feedback after 5 seconds
  useEffect(() => {
    if (feedback.type) {
      const timer = setTimeout(() => {
        setFeedback({ type: null, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback.type]);

  const handleVerDetalles = (relacion: UsuarioVehiculoRelacion) => {
    setSelectedRelacion(relacion);
    setShowDetallesModal(true);
  };

  const handleAbrirConfirmDesasignar = (relacion: UsuarioVehiculoRelacion) => {
    setRelacionParaDesasignar(relacion);
    setShowConfirmModal(true);
  };

  const handleConfirmarDesasignar = async () => {
    if (!relacionParaDesasignar) return;

    try {
      setDesasignando(true);
      await usuarioVehiculoService.desasignarRelacion(relacionParaDesasignar.id_usuario_vehiculo);

      // Success feedback
      setFeedback({
        type: 'success',
        message: `La relación entre ${relacionParaDesasignar.usuario.nombre} ${relacionParaDesasignar.usuario.apellido} y ${relacionParaDesasignar.vehiculo.nombre} ha sido desasignada exitosamente.`,
      });

      // Close modal and refetch data
      setShowConfirmModal(false);
      setRelacionParaDesasignar(null);

      // Refetch data
      const response: UsuarioVehiculoResponse = await usuarioVehiculoService.getAll(
        currentPage,
        pageSize
      );
      setRelaciones(response.data.data);
      setTotalPages(Math.ceil(response.data.total / pageSize));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al desasignar la relación';
      setFeedback({
        type: 'error',
        message,
      });
      console.error(err);
      
      // Asegurarnos de cerrar el modal también si falla
      setShowConfirmModal(false);
    } finally {
      setDesasignando(false);
    }
  };

  const handleCancelarDesasignar = () => {
    setShowConfirmModal(false);
    setRelacionParaDesasignar(null);
  };

  const handleAsignarClick = (vehiculo: VehiculoOption, usuario: User) => {
    setAsignarState({ vehiculo, usuario });
    setShowConfirmAsignarModal(true);
  };

  const handleConfirmarAsignar = async () => {
    if (!asignarState.vehiculo || !asignarState.usuario) return;

    try {
      setAsignando(true);
      await usuarioVehiculoService.asignarVehiculo(
        asignarState.usuario.dni,
        asignarState.vehiculo.id_vehiculo
      );

      // Success feedback
      setFeedback({
        type: 'success',
        message: `El vehículo ${asignarState.vehiculo.nombre} ha sido asignado exitosamente a ${asignarState.usuario.nombre} ${asignarState.usuario.apellido}.`,
      });

      // Close modal and reset form
      setShowConfirmAsignarModal(false);
      setAsignarState({ vehiculo: null, usuario: null });

      // Refetch data
      const response: UsuarioVehiculoResponse = await usuarioVehiculoService.getAll(
        currentPage,
        pageSize
      );
      setRelaciones(response.data.data);
      setTotalPages(Math.ceil(response.data.total / pageSize));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al asignar el vehículo';
      setFeedback({
        type: 'error',
        message,
      });
      console.error(err);
      
      setShowConfirmAsignarModal(false);
    } finally {
      setAsignando(false);
    }
  };

  const handleCancelarAsignar = () => {
    setShowConfirmAsignarModal(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            Relaciones Usuario-Vehículo
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Administra las asignaciones de vehículos a usuarios
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Success feedback */}
        {feedback.type === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{feedback.message}</p>
          </div>
        )}

        {/* Error feedback */}
        {feedback.type === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{feedback.message}</p>
          </div>
        )}

        {/* Asignar Form Section */}
        <div className="mb-12">
          <AsignarForm onAsignarClick={handleAsignarClick} />
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-navbar-bg)]"></div>
          </div>
        ) : relaciones.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-secondary)] text-lg">
              No hay relaciones usuario-vehículo registradas
            </p>
          </div>
        ) : (
          <>
            {/* Table Title */}
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
              Relaciones Existentes
            </h2>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[var(--color-navbar-bg)] text-[var(--color-navbar-text)]">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Código Vehículo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Nombre Vehículo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Nombre Usuario</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">DNI Usuario</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Fecha Desde</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Fecha Hasta</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {relaciones.map((relacion, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-[var(--color-text-primary)]">
                        {relacion.vehiculo.codigo}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-primary)]">
                        {relacion.vehiculo.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-primary)]">
                        {relacion.usuario.nombre} {relacion.usuario.apellido}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-primary)]">
                        {relacion.usuario.dni}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-primary)]">
                        {new Date(relacion.fecha_desde).toLocaleDateString('es-AR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-primary)]">
                        {relacion.fecha_hasta
                          ? new Date(relacion.fecha_hasta).toLocaleDateString('es-AR')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleVerDetalles(relacion)}
                          >
                            Ver Detalles
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleAbrirConfirmDesasignar(relacion)}
                            disabled={relacion.fecha_hasta !== null}
                          >
                            {relacion.fecha_hasta !== null ? 'Finalizada' : 'Desasignar'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-[var(--color-text-primary)]">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detalles Modal */}
      <DetallesRelacionModal
        isOpen={showDetallesModal}
        relacion={selectedRelacion}
        onClose={() => setShowDetallesModal(false)}
      />

      {/* Confirmar Desasignar Modal */}
      {relacionParaDesasignar && (
        <ConfirmarDesasignarModal
          isOpen={showConfirmModal}
          onConfirm={handleConfirmarDesasignar}
          onCancel={handleCancelarDesasignar}
          isLoading={desasignando}
          vehiculoNombre={relacionParaDesasignar.vehiculo.nombre}
          usuarioNombre={`${relacionParaDesasignar.usuario.nombre} ${relacionParaDesasignar.usuario.apellido}`}
        />
      )}

      {/* Confirmar Asignar Modal */}
      {asignarState.vehiculo && asignarState.usuario && (
        <ConfirmarAsignarModal
          isOpen={showConfirmAsignarModal}
          onConfirm={handleConfirmarAsignar}
          onCancel={handleCancelarAsignar}
          isLoading={asignando}
          vehiculoNombre={asignarState.vehiculo.nombre}
          vehiculoCodigo={asignarState.vehiculo.codigo}
          usuarioNombre={`${asignarState.usuario.nombre} ${asignarState.usuario.apellido}`}
          usuarioDni={String(asignarState.usuario.dni)}
        />
      )}
    </div>
  );
};

export default UsuarioVehiculoPage;