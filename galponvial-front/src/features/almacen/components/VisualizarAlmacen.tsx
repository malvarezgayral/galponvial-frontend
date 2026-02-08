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
import { ROUTES } from "@/app/routes"; // <--- CHEQUEÁ QUE ESTA RUTA SEA CORRECTA

import { GrupoCard } from "./GrupoCard";
import { EditGrupoModal } from "./EditGrupoModal";

const PAGE_SIZE = 6;

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
  
  const [localArticulos, setLocalArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [gruposLoading, setGruposLoading] = useState(false);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
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
      const response = await almacenService.getArticulos(currentPage, PAGE_SIZE);
      setLocalArticulos(response.data);
      setArticulos(response.data);
      setTotalItems(response.total);
    } catch (err) {
      const errorMsg = err instanceof Error ? err : new Error("Error al cargar artículos");
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticulos();
    fetchGrupos();
  }, [currentPage]);

  // Handlers Artículos
  const handleEdit = (articulo: Articulo) => {
    setEditingArticulo(articulo);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingArticulo(null);
  };

  const handleEditSuccess = () => {
    void fetchArticulos(); 
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
      setLocalArticulos((prev) => prev.filter(a => a.cod !== deletingArticulo.cod));
      setTotalItems((prev) => prev - 1);
      setShowDeleteModal(false);
      setDeletingArticulo(null);
      if (articulos.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
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

  const handleGrupoSuccess = () => {
    fetchGrupos(); 
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

  // ESTA ES LA FUNCIÓN CLAVE
  const handleViewGrupoDetails = (grupo: Grupo) => {
    if (!grupo || !grupo.id) return; // Protección extra
    navigate(ROUTES.grupoDetalles(grupo.id)); 
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

  return (
    <div className="space-y-8 pb-10">
      
      {/* --- SECCIÓN 1: FILTROS Y ARTÍCULOS --- */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            Gestión de Artículos
        </h2>

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
                {['pieza','caja','bulto','metro','litro','kg'].map(t => <option key={t} value={t}>{t}</option>)}
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
            <button onClick={resetFilters} className="text-sm text-blue-600 hover:underline">Limpiar filtros</button>
        </div>

        {/* Content Artículos */}
        {loading && currentPage === 1 ? (
             <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : filteredArticulos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No se encontraron artículos.</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticulos.map((articulo) => (
                    <ArticuloCard
                    key={articulo.cod}
                    articulo={articulo}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onViewDetails={handleViewDetails}
                    />
                ))}
                </div>
                <div className="text-sm text-gray-500 text-center mt-6">
                    Viendo {filteredArticulos.length} artículos
                </div>
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
        ) : grupos.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded border border-dashed">No hay grupos definidos.</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {grupos.map(grupo => (
                    // ACA ESTA EL TEMA: SI ESTA PROPIEDAD onViewDetails FALTA, EXPLOTA.
                    <GrupoCard 
                        key={grupo.id} 
                        grupo={grupo} 
                        onEdit={handleEditGrupo}
                        onDelete={handleDeleteGrupoClick}
                        onViewDetails={handleViewGrupoDetails} 
                    />
                ))}
            </div>
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