import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { almacenService } from "../services/almacenService";
import { useAlmacenStore } from "../store";
import { ArticuloCard } from "./ArticuloCard";
import { EditArticuloModal } from "./EditArticuloModal";
import type { Articulo } from "../types";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { ROUTES } from "@/app/routes";

const PAGE_SIZE = 6;

/**
 * Component for viewing warehouse articulos in card grid format
 */
export const VisualizarAlmacen: React.FC = () => {
  const navigate = useNavigate();
  // Traemos removeArticulo del store
  const { setArticulos, removeArticulo } = useAlmacenStore(); 
  
  const [articulos, setLocalArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
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
  }, [currentPage, setArticulos]);

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
      {/* Loading state */}
      {loading && currentPage === 1 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando artículos...</span>
        </div>
      )}

      {/* Cards grid */}
      {!loading && totalItems > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articulos.map((articulo) => (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                disabled={loading}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Page info */}
      {totalPages > 0 && (
        <div className="text-center text-sm text-gray-600">
          Página {currentPage} de {totalPages} ({totalItems} artículos totales)
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