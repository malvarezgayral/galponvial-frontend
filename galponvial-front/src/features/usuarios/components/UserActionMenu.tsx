import React, { useState } from 'react';
import { useUsuariosStore } from '../store';
import type { User } from '../types';

interface UserActionMenuProps {
  usuario: User;
}

const UserActionMenu: React.FC<UserActionMenuProps> = ({ usuario }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const {
    setUsuarioSeleccionado,
    setModoEdicion,
    setModalAbierto,
    toggleUsuarioActivo,
    eliminarUsuario,
  } = useUsuariosStore();

  const handleEditar = () => {
    setUsuarioSeleccionado(usuario);
    setModoEdicion(true);
    setModalAbierto(true);
    setMenuAbierto(false);
  };

  const handleToggleActivo = async () => {
    await toggleUsuarioActivo(usuario.dni.toString());
    setMenuAbierto(false);
  };

  const handleEliminar = async () => {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${usuario.nombre}?`)) {
      await eliminarUsuario(usuario.dni.toString());
      setMenuAbierto(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors cursor-pointer"
      >
        ⋮
      </button>

      {menuAbierto && (
        <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200">
          <button
            onClick={handleEditar}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            ✏️ Editar
          </button>
          <button
            onClick={handleToggleActivo}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t cursor-pointer"
          >
            {usuario.isActive ? '🔒 Desactivar' : '🔓 Activar'}
          </button>
          <button
            onClick={handleEliminar}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t cursor-pointer"
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default UserActionMenu;
