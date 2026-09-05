/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { almacenService } from "../services/almacenService";
import { useAlmacenStore } from "../store";
import { ArticuloCard } from "./ArticuloCard";
import { EditArticuloModal } from "./EditArticuloModal";
import type { Articulo, Grupo } from "../types";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { ROUTES } from "@/app/routes";
import { handleApiError, type ApiError } from "@/services/errorHandler";
import { GrupoCard } from "./GrupoCard";
import { EditGrupoModal } from "./EditGrupoModal";
import { useAdminPermissions } from "@/features/usuarios/hooks/useAdminPermissions";

const ARTICLES_PER_PAGE = 6;
const GROUPS_PER_PAGE = 4; 

export const VisualizarAlmacen: React.FC = () => {
  const navigate = useNavigate();
  
  const { 
    setArticulos, 
    setGrupos, 
    removeArticulo, 
    removeGrupo, 
    articulos, 
    filteredArticulos,
    grupos, 
    filters, 
    setFilter, 
    resetFilters 
  } = useAlmacenStore();
  
  const { isAdmin } = useAdminPermissions();
  const { isSuperAdmin } = useAdminPermissions()
  const canEdit = isAdmin() || isSuperAdmin();
  const canDelete = isSuperAdmin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [gruposLoading, setGruposLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);

  // Sort filteredArticulos alphabetically before paginating
  const sortedArticulos = [...filteredArticulos].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
  );

  const indexOfLastArticulo = currentPage * ARTICLES_PER_PAGE;
  const indexOfFirstArticulo = indexOfLastArticulo - ARTICLES_PER_PAGE;
  const currentRenderedArticulos = sortedArticulos.slice(indexOfFirstArticulo, indexOfLastArticulo);
  
  const totalPages = Math.ceil(sortedArticulos.length / ARTICLES_PER_PAGE);

  const [currentGrupoPage, setCurrentGrupoPage] = useState(1);

  // Sort grupos alphabetically before paginating
  const sortedGrupos = [...grupos].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
  );

  const indexOfLastGrupo = currentGrupoPage * GROUPS_PER_PAGE;
  const indexOfFirstGrupo = indexOfLastGrupo - GROUPS_PER_PAGE;
  const currentRenderedGrupos = sortedGrupos.slice(indexOfFirstGrupo, indexOfLastGrupo);
  
  const totalGrupoPages = Math.ceil(sortedGrupos.length / GROUPS_PER_PAGE);

  // Modales Artículos
  const [editingArticulo, setEditingArticulo] = useState<Articulo | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingArticulo, setDeletingArticulo] = useState<Articulo | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Modales Grupos
  const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null);
  const [showEditGrupoModal, setShowEditGrupoModal] = useState(false);
  const [deletingGrupo, setDeletingGrupo] = useState<Grupo | null>(null);
  const [showDeleteGrupoModal, setShowDeleteGrupoModal] = useState(false);
  const [deleteGrupoLoading, setDeleteGrupoLoading] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, articulos]); 

  useEffect(() => {
    const fetchAllData = async () => {
        setLoading(true);
        setGruposLoading(true);
        try {
            const [articulosData, gruposData] = await Promise.all([
                almacenService.getArticulos(1, 10000), 
                almacenService.getGrupos()
            ]);

            setArticulos(articulosData.data || articulosData); 
            setGrupos(gruposData);
        } catch (err) {
            console.error(err);
            const apiError = handleApiError(err);
            setError(apiError);
        } finally {
            setLoading(false);
            setGruposLoading(false);
        }
    };

    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers Paginación ARTÍCULOS
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Handlers Paginación GRUPOS
  const handlePrevGrupoPage = () => {
    if (currentGrupoPage > 1) setCurrentGrupoPage((prev) => prev - 1);
  };

  const handleNextGrupoPage = () => {
    if (currentGrupoPage < totalGrupoPages) setCurrentGrupoPage((prev) => prev + 1);
  };

  // Handlers Acciones
  const handleEdit = (articulo: Articulo) => {
    setEditingArticulo(articulo);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingArticulo(null);
  };

  const handleEditSuccess = async () => {
     const res = await almacenService.getArticulos(1, 10000);
     setArticulos(res.data || res);
  };

  const handleDeleteClick = (articulo: Articulo) => {
    setDeletingArticulo(articulo);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingArticulo) return;
    setDeleteLoading(true);
    try {
      await removeArticulo(Number(deletingArticulo.cod));
      setShowDeleteModal(false);
      setDeletingArticulo(null);
    } catch (err) {
      alert("Hubo un error al eliminar el artículo");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewDetails = (articulo: Articulo) => {
    navigate(ROUTES.articuloDetalles(articulo.cod));
  };

  // Handlers Grupos
  const handleEditGrupo = (grupo: Grupo) => {
    setEditingGrupo(grupo);
    setShowEditGrupoModal(true);
  };

  const handleGrupoSuccess = async () => {
    const data = await almacenService.getGrupos();
    setGrupos(data);
  };

  const handleDeleteGrupoClick = (grupo: Grupo) => {
    setDeletingGrupo(grupo);
    setShowDeleteGrupoModal(true);
  };

  const handleConfirmDeleteGrupo = async () => {
    if(!deletingGrupo) return;
    setDeleteGrupoLoading(true);
    try {
        await removeGrupo(deletingGrupo.id);
        setShowDeleteGrupoModal(false);
        setDeletingGrupo(null);
    } catch (err: any) {
        alert(err.response?.data?.message || "Error al eliminar");
    } finally {
        setDeleteGrupoLoading(false);
    }
  };

  const handleViewGrupoDetails = (grupo: Grupo) => {
    if (!grupo || !grupo.id) return; 
    navigate(ROUTES.grupoDetalles(grupo.id)); 
  };

  if (error && articulos.length === 0) {
    const isPermissionError = error.isPermissionError;
    const permissionIcon = isPermissionError ? '🔒' : '⚠️';
    
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className={`p-6 border rounded-lg ${
          isPermissionError 
            ? 'bg-amber-50 border-amber-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-4">
            <span className="text-3xl">{permissionIcon}</span>
            <div className="flex-1">
              <p className={`font-semibold ${
                isPermissionError 
                  ? 'text-amber-900' 
                  : 'text-red-800'
              }`}>
                {isPermissionError ? 'Permiso Insuficiente' : 'Error al Cargar'}
              </p>
              <p className={`text-sm mt-2 ${
                isPermissionError 
                  ? 'text-amber-800' 
                  : 'text-red-700'
              }`}>
                {error.message}
              </p>
              {error.details && (
                <details className="mt-3 text-xs opacity-75 cursor-pointer">
                  <summary className="font-medium">Detalles técnicos</summary>
                  <pre className="mt-2 overflow-auto rounded bg-black/5 p-2">
                    {JSON.stringify(error.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* --- SECCIÓN 1: FILTROS Y ARTÍCULOS --- */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Contenedor Flex para Título y Botón */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Gestión de Artículos
          </h2>
          
          {/* Botón de Papelera - Solo visible si es admin o superadmin */}
          {(isAdmin() || isSuperAdmin()) && (
            <button
              onClick={() => navigate(ROUTES.articulosEliminados)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Papelera de Artículos
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
            {/* Search */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Búsqueda</label>
            <input
                type="text"
                placeholder="Nombre, modelo o código..."
                value={filters.searchTerm}
                onChange={(e) => setFilter("searchTerm", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
            {/* Unidad Tipo */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Unidad</label>
            <select
                value={filters.unidad_tipo || ""}
                onChange={(e) => setFilter("unidad_tipo", e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                <option value="">Todos</option>
                {['pieza', 'caja', 'kilogramo', 'metro', 'litro', 'unidad',  'volumen',  'distancia', 'paquete'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            </div>
            {/* Grupo Filter */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Grupo</label>
            <select
                value={filters.grupo || ""}
                onChange={(e) => setFilter("grupo", e.target.value || null)}
                disabled={gruposLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                <option value="">Todos</option>
                {grupos.map((g) => (<option key={g.id} value={g.id}>{g.nombre}</option>))}
            </select>
            </div>
            {/* Stock */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mínimo Stock</label>
                <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={filters.stockRange?.min || ""}
                    onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : 0;
                        setFilter("stockRange", { min: val, max: 999999 });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
        
        <div className="flex justify-end mb-6">
            <button onClick={resetFilters} className="text-sm text-blue-600 hover:underline cursor-pointer">Limpiar filtros</button>
        </div>

        {/* Content Artículos */}
        {loading ? (
             <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : sortedArticulos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No se encontraron artículos con esos filtros.</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentRenderedArticulos.map((articulo) => (
                    <ArticuloCard
                      key={articulo.cod}
                      articulo={articulo}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onViewDetails={handleViewDetails}
                      canEdit={canEdit}       
                      canDelete={canDelete}   
                    />
                ))}
                </div>

                {/* BARRA DE PAGINACIÓN ARTÍCULOS */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                        <div className="text-sm text-gray-500">
                            Mostrando {indexOfFirstArticulo + 1} - {Math.min(indexOfLastArticulo, sortedArticulos.length)} de {sortedArticulos.length} resultados
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                                    ${currentPage === 1 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Anterior
                            </button>
                            
                            <div className="hidden sm:flex items-center px-2">
                                <span className="text-sm font-medium text-gray-700">
                                    {currentPage} <span className="text-gray-400">/</span> {totalPages}
                                </span>
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage >= totalPages}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                                    ${currentPage >= totalPages 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </>
        )}
      </div>

      {/* --- SECCIÓN 2: GRUPOS DE ARTÍCULOS --- */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                Grupos de Artículos
            </h2>
        </div>

        {gruposLoading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div></div>
        ) : sortedGrupos.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded border border-dashed">No hay grupos definidos.</div>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {currentRenderedGrupos.map(grupo => (
                        <GrupoCard
                          key={grupo.id}
                          grupo={grupo}
                          onEdit={handleEditGrupo}
                          onDelete={handleDeleteGrupoClick}
                          onViewDetails={handleViewGrupoDetails}
                          canEdit={canEdit}       
                          canDelete={canDelete}  
                        />
                    ))}
                </div>

                 {/* BARRA DE PAGINACIÓN GRUPOS */}
                 {totalGrupoPages > 1 && (
                    <div className="mt-6 flex items-center justify-end border-t border-gray-100 pt-4 gap-2">
                            <button
                                onClick={handlePrevGrupoPage}
                                disabled={currentGrupoPage === 1}
                                className={`px-3 py-1 text-sm rounded transition-colors
                                    ${currentGrupoPage === 1 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'text-indigo-600 hover:bg-indigo-50'
                                    }`}
                            >
                                Anterior
                            </button>
                            <span className="text-sm text-gray-500">{currentGrupoPage} / {totalGrupoPages}</span>
                            <button
                                onClick={handleNextGrupoPage}
                                disabled={currentGrupoPage >= totalGrupoPages}
                                className={`px-3 py-1 text-sm rounded transition-colors
                                    ${currentGrupoPage >= totalGrupoPages 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'text-indigo-600 hover:bg-indigo-50'
                                    }`}
                            >
                                Siguiente
                            </button>
                    </div>
                )}
            </>
        )}
      </div>

      {/* --- MODALES --- */}
      <EditArticuloModal
        isOpen={showEditModal}
        articulo={editingArticulo}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Eliminar Artículo"
        message={`¿Estás seguro de que deseas eliminar "${deletingArticulo?.nombre}"?`}
      />

      <EditGrupoModal
        isOpen={showEditGrupoModal}
        grupo={editingGrupo}
        onClose={() => setShowEditGrupoModal(false)}
        onSuccess={handleGrupoSuccess}
      />
      <DeleteConfirmationModal
        isOpen={showDeleteGrupoModal}
        onClose={() => setShowDeleteGrupoModal(false)}
        onConfirm={handleConfirmDeleteGrupo}
        loading={deleteGrupoLoading}
        title="Eliminar Grupo"
        message={`¿Eliminar el grupo "${deletingGrupo?.nombre}"? Si tiene artículos asociados no se podrá eliminar.`}
      />
    </div>
  );
};