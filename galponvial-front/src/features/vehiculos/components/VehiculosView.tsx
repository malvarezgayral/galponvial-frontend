import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVehiculosStore } from "../store";
import { useAppStore } from "@/app/stores/appStore";
import { ROUTES } from "@/app/routes";
import { VehiculoCard } from "./VehiculoCard";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { EditVehiculoModal } from "./EditVehiculoModal";
import type { Vehiculo } from "../types";

/**
 * View component for displaying and filtering vehicles
 */
export const VehiculosView: React.FC = () => {
  const navigate = useNavigate();
  const {
    vehiculos,
    filteredVehiculos,
    dropdownData,
    listLoading,
    listError,
    filters,
    fetchAllVehiculos,
    fetchDropdownOptions,
    setFilter,
    resetFilters,
    deleteVehiculo,
  } = useVehiculosStore();

  const { user } = useAppStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVehiculoIdForEdit, setSelectedVehiculoIdForEdit] = useState<
    number | null
  >(null);

  // Check if user can delete (admin or superadmin)
  const canDelete =
    user &&
    "rol" in user &&
    (user.rol === "admin" || user.rol === "super-admin");

  /**
   * Load vehicles on component mount
   */
  useEffect(() => {
    fetchAllVehiculos();
    fetchDropdownOptions();
  }, [fetchAllVehiculos, fetchDropdownOptions]);

  /**
   * Handle edit vehicle
   */
  const handleEdit = (vehiculo: Vehiculo) => {
    console.log(vehiculo.id_vehiculo);
    setSelectedVehiculoIdForEdit(vehiculo.id_vehiculo);
    setEditModalOpen(true);
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteClick = (vehiculo: Vehiculo) => {
    if (!canDelete) {
      setDeleteError("No tienes permisos para eliminar vehículos");
      return;
    }
    setSelectedVehiculo(vehiculo);
    setDeleteModalOpen(true);
  };

  /**
   * Confirm delete
   */
  const handleConfirmDelete = async () => {
    if (!selectedVehiculo) return;

    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteVehiculo(selectedVehiculo.id_vehiculo);
      setDeleteModalOpen(false);
      setSelectedVehiculo(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al eliminar";
      setDeleteError(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Handle view details
   */
  const handleViewDetails = (vehiculo: Vehiculo) => {
    navigate(ROUTES.vehiculoDetalles(vehiculo.id_vehiculo));
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Filtros</h2>

        {deleteError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            {deleteError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search by name or codigo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por nombre o código
            </label>
            <input
              type="text"
              placeholder="Buscar..."
              value={filters.searchTerm}
              onChange={(e) => setFilter("searchTerm", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado del vehículo
            </label>
            <select
              value={filters.estado || ""}
              onChange={(e) => setFilter("estado", e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              {dropdownData?.estados.map((estado) => (
                <option key={estado.id} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de vehículo
            </label>
            <select
              value={filters.tipo || ""}
              onChange={(e) => setFilter("tipo", e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              {dropdownData?.tiposVehiculo.map((tipo) => (
                <option key={tipo.id} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by sector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector de pertenencia
            </label>
            <select
              value={filters.sector || ""}
              onChange={(e) => setFilter("sector", e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los sectores</option>
              {dropdownData?.sectoresPertenencia.map((sector) => (
                <option key={sector.id} value={sector.value}>
                  {sector.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset filters button */}
        <button
          onClick={resetFilters}
          className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Loading state */}
      {listLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {listError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {listError}
        </div>
      )}

      {/* Empty state */}
      {!listLoading && filteredVehiculos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {vehiculos.length === 0
              ? "No hay vehículos disponibles"
              : "No hay vehículos que coincidan con los filtros"}
          </p>
        </div>
      )}

      {/* Vehicles grid */}
      {!listLoading && filteredVehiculos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehiculos.map((vehiculo) => (
            <VehiculoCard
              key={vehiculo.id_vehiculo}
              vehiculo={vehiculo}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {!listLoading && filteredVehiculos.length > 0 && (
        <div className="text-sm text-gray-600 text-center mt-6">
          Mostrando {filteredVehiculos.length} de {vehiculos.length} vehículos
        </div>
      )}

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        vehiculoNombre={selectedVehiculo?.nombre || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedVehiculo(null);
          setDeleteError(null);
        }}
        isLoading={deleteLoading}
      />

      {/* Edit vehicle modal */}
      <EditVehiculoModal
        isOpen={editModalOpen}
        vehiculoId={selectedVehiculoIdForEdit}
        dropdownData={dropdownData}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedVehiculoIdForEdit(null);
        }}
      />
    </div>
  );
};
