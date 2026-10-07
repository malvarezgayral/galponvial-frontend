/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { almacenService } from "../services/almacenService";
import { useAlmacenStore } from "../store";
import type { Grupo } from "../types";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { ROUTES } from "@/app/routes";
import { GrupoCard } from "./GrupoCard";
import { EditGrupoModal } from "./EditGrupoModal";
import { useAdminPermissions } from "@/features/usuarios/hooks/useAdminPermissions";

const GROUPS_PER_PAGE = 4;

export const StockAlmacen: React.FC = () => {
  const navigate = useNavigate();
  const { setGrupos, removeGrupo, grupos } = useAlmacenStore();
  const { isAdmin, isSuperAdmin } = useAdminPermissions();
  const canEdit = isAdmin() || isSuperAdmin();
  const canDelete = isSuperAdmin();

  const [gruposLoading, setGruposLoading] = useState(true);
  const [currentGrupoPage, setCurrentGrupoPage] = useState(1);

  const sortedGrupos = [...grupos].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
  );
  const indexOfLastGrupo = currentGrupoPage * GROUPS_PER_PAGE;
  const indexOfFirstGrupo = indexOfLastGrupo - GROUPS_PER_PAGE;
  const currentRenderedGrupos = sortedGrupos.slice(indexOfFirstGrupo, indexOfLastGrupo);
  const totalGrupoPages = Math.ceil(sortedGrupos.length / GROUPS_PER_PAGE);

  const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null);
  const [showEditGrupoModal, setShowEditGrupoModal] = useState(false);
  const [deletingGrupo, setDeletingGrupo] = useState<Grupo | null>(null);
  const [showDeleteGrupoModal, setShowDeleteGrupoModal] = useState(false);
  const [deleteGrupoLoading, setDeleteGrupoLoading] = useState(false);

  useEffect(() => {
    const fetchGrupos = async () => {
      setGruposLoading(true);
      try {
        const data = await almacenService.getGrupos();
        setGrupos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setGruposLoading(false);
      }
    };
    fetchGrupos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrevGrupoPage = () => {
    if (currentGrupoPage > 1) setCurrentGrupoPage((prev) => prev - 1);
  };

  const handleNextGrupoPage = () => {
    if (currentGrupoPage < totalGrupoPages) setCurrentGrupoPage((prev) => prev + 1);
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

  return (
    <div className="space-y-8 pb-10">
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
