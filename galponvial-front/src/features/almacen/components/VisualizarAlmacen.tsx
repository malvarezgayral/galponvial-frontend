import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { almacenService } from "../services/almacenService";
import { useAlmacenStore } from "../store";
import { ArticuloCard } from "./ArticuloCard";
import { EditArticuloModal } from "./EditArticuloModal";
import type { Articulo, Grupo } from "../types";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { ROUTES } from "@/app/routes";

const PAGE_SIZE = 6;

/**
 * Component for viewing warehouse articulos in card grid format
 */
export const VisualizarAlmacen: React.FC = () => {
  const navigate = useNavigate();
  // Traemos removeArticulo del store
  const { setArticulos, setGrupos, removeArticulo, articulos, filteredArticulos, grupos, filters, setFilter, resetFilters } = useAlmacenStore(); 
  
  const [localArticulos, setLocalArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [gruposLoading, setGruposLoading] = useState(false);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Estado para Edición
  const [editingArticulo, setEditingArticulo] = useState<Articulo | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Estado para Eliminación (NUEVO)
  const [deletingArticulo, setDeletingArticulo] = useState<Articulo | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  // Cargar grupos
  const fetchGrupos = async () => {
    try {
      setGruposLoading(true);
      const data = await almacenService.getGrupos();
      setGrupos(data);
    } catch (err) {
      console.error("Error fetching grupos:", err);
    } finally {
      setGruposLoading(false);
    }
  };

  // Cargar artículos
  const fetchArticulos = async () => {
    try {
      setLoading(true);
      const response = await almacenService.getArticulos(
        currentPage,
        PAGE_SIZE,
      );
      setLocalArticulos(response.data);
      setArticulos(response.data);
      setTotalItems(response.total);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err : new Error("Error al cargar artículos");
      setError(errorMsg);
      console.error("Error fetching articulos:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticulos();
    fetchGrupos();
  }, [currentPage, setArticulos, setGrupos]);

  // --- Lógica de Edición ---
  const handleEdit = (articulo: Articulo) => {
    setEditingArticulo(articulo);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingArticulo(null);
  };

  const handleEditSuccess = () => {
    void fetchArticulos(); // Recargar datos tras editar
  };

  // --- Lógica de Eliminación (NUEVO) ---
  const handleDeleteClick = (articulo: Articulo) => {
    setDeletingArticulo(articulo);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingArticulo) return;

    setDeleteLoading(true);
    try {
      await removeArticulo(Number(deletingArticulo.cod));

      setLocalArticulos((prev) => prev.filter(a => a.cod !== deletingArticulo.cod));
      setTotalItems((prev) => prev - 1);
      
      setShowDeleteModal(false);
      setDeletingArticulo(null);
      
      if (articulos.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
      }
      
    } catch (err) {
      console.error("Error eliminando:", err);
      alert("Hubo un error al eliminar el artículo");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewDetails = (articulo: Articulo) => {
    navigate(ROUTES.articuloDetalles(articulo.cod), { 
    state: { articulo } 
  });
};

  if (error && articulos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-medium">Error al cargar datos</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (articulos.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">
            No hay artículos registrados en el almacén
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search by name, modelo or codigo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por nombre, modelo o código
            </label>
            <input
              type="text"
              placeholder="Buscar..."
              value={filters.searchTerm}
              onChange={(e) => setFilter("searchTerm", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by unidad_tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de unidad
            </label>
            <select
              value={filters.unidad_tipo || ""}
              onChange={(e) => setFilter("unidad_tipo", e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="pieza">Pieza</option>
              <option value="caja">Caja</option>
              <option value="bulto">Bulto</option>
              <option value="metro">Metro</option>
              <option value="litro">Litro</option>
              <option value="kg">Kilogramo</option>
            </select>
          </div>

          {/* Filter by grupo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grupo
            </label>
            <select
              value={filters.grupo || ""}
              onChange={(e) => setFilter("grupo", e.target.value || null)}
              disabled={gruposLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Todos los grupos</option>
              {grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by stock range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="number"
              placeholder="Mín. stock"
              min="0"
              value={filters.stockRange?.min || ""}
              onChange={(e) => {
                const minValue = e.target.value ? Number(e.target.value) : 0;
                const maxValue = filters.stockRange?.max || 999999;
                setFilter("stockRange", { min: minValue, max: maxValue });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
      {loading && currentPage === 1 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando artículos...</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredArticulos.length === 0 && articulos.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No hay artículos que coincidan con los filtros
          </p>
        </div>
      )}

      {/* Cards grid */}
      {!loading && filteredArticulos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticulos.map((articulo) => (
            <ArticuloCard
              key={articulo.cod || articulo.cod} // Usar ID único
              articulo={articulo}
              onEdit={handleEdit}
              onDelete={handleDeleteClick} // Conectado al click handler
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {!loading && filteredArticulos.length > 0 && (
        <div className="text-sm text-gray-600 text-center mt-6">
          Mostrando {filteredArticulos.length} de {articulos.length} artículos
        </div>
      )}

      {/* Edit Modal */}
      <EditArticuloModal
        isOpen={showEditModal}
        articulo={editingArticulo}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Eliminar Artículo"
        message={`¿Estás seguro de que deseas eliminar el artículo "${deletingArticulo?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};