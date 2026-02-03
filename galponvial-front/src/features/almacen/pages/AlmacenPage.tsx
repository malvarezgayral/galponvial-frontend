import { useState } from "react";
import { CreateGrupoArticuloForm } from "../components/CreateGrupoArticuloForm";
import { CreateArticuloForm } from '../components/CreateArticuloForm';
import { VisualizarAlmacen } from '../components/VisualizarAlmacen';
import { useAlmacenPermissions } from '../hooks/useAlmacenPermissions';

type AlmacenView = "administrar" | "visualizar";

/**
 * Almacén Page - Main warehouse management page
 */
export default function AlmacenPage() {
  const { hasWritePermission } = useAlmacenPermissions();
  const canAdminister = hasWritePermission();
  
  // Si no tiene permisos de escritura, mostrar solo visualizar
  const [currentView, setCurrentView] = useState<AlmacenView>(
    canAdminister ? 'administrar' : 'visualizar'
  );
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleArticuloCreated = () => {
    // Trigger refetch in visualizar component if needed
    setRefetchTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Almacén</h1>

        {/* Toggle Buttons - Solo mostrar tab de administrar si tiene permisos */}
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1 w-fit">
          {canAdminister && (
            <button
              onClick={() => setCurrentView('administrar')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                currentView === 'administrar'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Administrar Almacén
            </button>
          )}
          <button
            onClick={() => setCurrentView("visualizar")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              currentView === "visualizar"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Visualizar Almacén
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {currentView === "administrar" && (
          <div className="space-y-8">
            <CreateArticuloForm onSuccess={handleArticuloCreated} />
            <CreateGrupoArticuloForm />
          </div>
        )}

        {currentView === "visualizar" && (
          <VisualizarAlmacen key={refetchTrigger} />
        )}
      </div>
    </div>
  );
}
