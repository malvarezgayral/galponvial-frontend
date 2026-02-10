import React, { useState, useEffect } from 'react';
import { usuarioVehiculoService } from '../services/usuarioVehiculoService';
import type { UsuarioVehiculoRelacion, UsuarioVehiculoResponse } from '../types';
import { DetallesRelacionModal } from '../components/DetallesRelacionModal';
import { Button } from '@/shared/ui/Button';

/**
 * Page for managing usuario-vehículo relationships
 * Shows a table with all relationships and allows viewing details and unassigning
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
  const [desasignando, setDesasignando] = useState<number | null>(null);

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

  const handleVerDetalles = (relacion: UsuarioVehiculoRelacion) => {
    setSelectedRelacion(relacion);
    setShowDetallesModal(true);
  };

  const handleDesasignar = async (id: number) => {
    if (!window.confirm('¿Está seguro que desea desasignar esta relación?')) {
      return;
    }

    try {
      setDesasignando(id);
      await usuarioVehiculoService.desasignarRelacion(id);
      // Refresh the list after successful unassignment
      const response: UsuarioVehiculoResponse = await usuarioVehiculoService.getAll(
        currentPage,
        pageSize
      );
      setRelaciones(response.data.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al desasignar la relación';
      setError(message);
      console.error(err);
    } finally {
      setDesasignando(null);
    }
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
                            onClick={() => handleDesasignar(relacion.id_usuario_vehiculo)}
                            isLoading={desasignando === relacion.id_usuario_vehiculo}
                            disabled={desasignando !== null || relacion.fecha_hasta !== null}
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
    </div>
  );
};

export default UsuarioVehiculoPage;
