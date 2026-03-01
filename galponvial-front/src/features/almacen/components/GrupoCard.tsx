import type { Grupo } from '../types';
import { useAlmacenPermissions } from '../hooks/useAlmacenPermissions';

interface GrupoCardProps {
  grupo: Grupo;
  onEdit: (grupo: Grupo) => void;
  onDelete: (grupo: Grupo) => void;
  onViewDetails: (grupo: Grupo) => void;
}

export const GrupoCard: React.FC<GrupoCardProps> = ({
  grupo,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  // ✅ AGREGAR: Hook de permisos
  const { hasWritePermission } = useAlmacenPermissions();
  const canEdit = hasWritePermission();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Contenido del grupo */}
      <h3 className="font-bold">{grupo.nombre}</h3>
      <p className="text-sm text-gray-600">{grupo.descripcion}</p>
      
      {/* Botón ver más siempre visible */}
      <button onClick={() => onViewDetails(grupo)}>Ver Detalles</button>
      
      {/* ✅ Botones de editar/eliminar solo si tiene permisos */}
      {canEdit && (
        <div className="flex gap-2 mt-2">
          <button onClick={() => onEdit(grupo)}>Editar</button>
          <button onClick={() => onDelete(grupo)}>Eliminar</button>
        </div>
      )}
    </div>
  );
};