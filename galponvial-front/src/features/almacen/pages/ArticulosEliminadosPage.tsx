import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/services/errorHandler";
import { ROUTES } from "@/app/routes";
import type { Articulo } from "../types";
import { almacenService } from "../services/almacenService";

const ArticulosEliminadosPage = () => {
  const navigate = useNavigate();
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchEliminados = async () => {
    setLoading(true);
    try {
      const data = await almacenService.getDeletedArticulos();
      setArticulos(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEliminados();
  }, []);

  const handleRestore = async (cod: number) => {
    setActionLoading(cod);
    try {
      await almacenService.restoreArticulo(cod);
      setArticulos((prev) => prev.filter((art) => art.cod !== cod));
    } catch (err) {
      handleApiError(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(ROUTES.almacen)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <span>&larr;</span> Volver a Gestión
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          Papelera de Artículos
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : articulos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded border border-dashed text-gray-500">
            La papelera está vacía.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {articulos.map((art) => (
              <li key={art.cod} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{art.nombre} - {art.modelo}</p>
                  <p className="text-sm text-gray-500">Cód: {art.cod_proveedor}</p>
                </div>
                <button
                  onClick={() => handleRestore(art.cod)}
                  disabled={actionLoading === art.cod}
                  className="px-4 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 disabled:opacity-50 transition-colors"
                >
                  {actionLoading === art.cod ? "Restaurando..." : "Restaurar"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ArticulosEliminadosPage;