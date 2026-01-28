import React, { useEffect, useState } from "react";
import { useUsuariosStore } from "../store";
import { usuariosService } from "../services/usuariosService";
import { Button } from "@/shared/ui/Button";
import { Table } from "@/shared/ui/Table";
import UserFormModal from "./UserFormModal";
import LogoutConfirmModal from "./LogoutConfirmModal";
import type { User } from "../types";
import type { ObjectServiceResponse } from "@/shared/types/common-types";

const AdminDashboard: React.FC = () => {
  const {
    usuarios,
    usuariosTotal,
    usuariosPagina,
    usuariosPageSize,
    isLoading,
    error,
    modalAbierto,
    setModalAbierto,
    setModoEdicion,
    setUsuarioSeleccionado,
    fetchUsuarios,
  } = useUsuariosStore();

  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    usuario: User | null;
    newStatus: boolean;
    isLoading: boolean;
    error: string | null;
  }>({
    visible: false,
    usuario: null,
    newStatus: false,
    isLoading: false,
    error: null,
  });

  const [logoutModal, setLogoutModal] = useState<{
    visible: boolean;
    usuario: User | null;
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
  }>({
    visible: false,
    usuario: null,
    isLoading: false,
    error: null,
    successMessage: null,
  });

  useEffect(() => {
    async function loadUsuarios() {
      await fetchUsuarios(usuariosPagina, usuariosPageSize);
    }
    loadUsuarios();
  }, [usuariosPagina, usuariosPageSize, fetchUsuarios]);

  // Auto-refresh when modal closes (after user action)
  useEffect(() => {
    if (!modalAbierto) {
      async function reloadUsuarios() {
        await fetchUsuarios(usuariosPagina, usuariosPageSize);
      }
      reloadUsuarios();
    }
  }, [modalAbierto, fetchUsuarios, usuariosPagina, usuariosPageSize]);

  const handleCrearUsuario = () => {
    setUsuarioSeleccionado(null);
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const totalPages = Math.ceil(usuariosTotal / usuariosPageSize);

  const handleEditarUsuario = (usuario: User) => {
    setUsuarioSeleccionado(usuario);
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const handleToggleStatus = (usuario: User) => {
    setConfirmModal({
      visible: true,
      usuario,
      newStatus: !usuario.isActive,
      isLoading: false,
      error: null,
    });
  };

  const handleLogoutUser = (usuario: User) => {
    setLogoutModal({
      visible: true,
      usuario,
      isLoading: false,
      error: null,
      successMessage: null,
    });
  };

  const handleConfirmLogout = async () => {
    if (!logoutModal.usuario) return;

    setLogoutModal((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      successMessage: null,
    }));

    try {
      const response: ObjectServiceResponse<{
        revoked: boolean
      }> = await usuariosService.logoutUser(
        logoutModal.usuario.email,
      );
      if (response.success) {
        setLogoutModal((prev) => ({
          ...prev,
          isLoading: false,
          successMessage: `${logoutModal.usuario?.nombre} ha sido deslogueado correctamente.`,
        }));
      } else {
        setLogoutModal((prev) => ({
          ...prev,
          isLoading: false,
          error: response.message || "Error al desloguear al usuario",
        }));
      }

      // Close modal and refresh after 2 seconds
      setTimeout(() => {
        setLogoutModal({
          visible: false,
          usuario: null,
          isLoading: false,
          error: null,
          successMessage: null,
        });
        fetchUsuarios(usuariosPagina, usuariosPageSize);
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al desloguear al usuario";
      console.error("Error logging out user:", error);

      setLogoutModal((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      // Close modal after 3 seconds
      setTimeout(() => {
        setLogoutModal({
          visible: false,
          usuario: null,
          isLoading: false,
          error: null,
          successMessage: null,
        });
      }, 3000);
    }
  };

  const handleConfirmStatus = async () => {
    if (!confirmModal.usuario) return;

    setConfirmModal((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await usuariosService.updateStatus(
        confirmModal.usuario.dni,
        confirmModal.newStatus,
      );
      setConfirmModal({
        visible: false,
        usuario: null,
        newStatus: false,
        isLoading: false,
        error: null,
      });
      // Refresh users by triggering the effect
      await fetchUsuarios(usuariosPagina, usuariosPageSize);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar el estado del usuario";
      console.error("Error updating user status:", error);

      // Show error for 3 seconds then close modal
      setConfirmModal((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      setTimeout(() => {
        setConfirmModal({
          visible: false,
          usuario: null,
          newStatus: false,
          isLoading: false,
          error: null,
        });
      }, 3000);
    }
  };

  const columns = [
    {
      key: "nombre" as const,
      label: "Nombre",
      render: (_value: string, row: User) => `${row.nombre} ${row.apellido}`,
    },
    {
      key: "email" as const,
      label: "Email",
    },
    {
      key: "isActive" as const,
      label: "Estado",
      render: (value: boolean, row: User) => (
        <button
          onClick={() => handleToggleStatus(row)}
          className="px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-all duration-200 hover:opacity-80"
          style={{
            backgroundColor: value ? "#dcfce7" : "#fee2e2",
            color: value ? "#166534" : "#991b1b",
          }}
        >
          {value ? "Activo" : "Inactivo"}
        </button>
      ),
    },
    {
      key: "acciones" as const,
      label: "Acciones",
      render: (_value: unknown, row: User) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditarUsuario(row)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
            title="Editar usuario"
            aria-label="Editar usuario"
          >
            ✏️
          </button>
          <button
            onClick={() => handleLogoutUser(row)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 transition-colors duration-200"
            title="Cerrar sesión del usuario"
            aria-label="Cerrar sesión"
          >
            🚪
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 mt-1">
            Total: {usuariosTotal} usuario{usuariosTotal !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleCrearUsuario}
          disabled={isLoading}
        >
          + Crear Usuario
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && usuarios && usuarios.length > 0 && (
        <>
          <Table
            data={usuarios}
            columns={columns}
            className="border-gray-300"
            rowClassName="hover:bg-gray-50"
          />

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Página {usuariosPagina} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={usuariosPagina <= 1}
                onClick={() =>
                  useUsuariosStore.setState({
                    usuariosPagina: usuariosPagina - 1,
                  })
                }
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={usuariosPagina >= totalPages}
                onClick={() =>
                  useUsuariosStore.setState({
                    usuariosPagina: usuariosPagina + 1,
                  })
                }
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!isLoading && usuarios && usuarios.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No hay usuarios registrados</p>
          <p className="text-gray-500 mt-2">
            Haz clic en "Crear Usuario" para agregar uno
          </p>
        </div>
      )}

      {/* Modal */}
      {modalAbierto && <UserFormModal />}

      {/* Confirmation Modal for Status Change */}
      {confirmModal.visible && confirmModal.usuario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
              {confirmModal.newStatus
                ? "Activar Usuario"
                : "Desactivar Usuario"}
            </h2>
            <p className="text-gray-700 mb-4">
              ¿Deseas{" "}
              <strong>
                {confirmModal.newStatus ? "activar" : "desactivar"}
              </strong>{" "}
              a{" "}
              <strong>
                {confirmModal.usuario.nombre} {confirmModal.usuario.apellido}
              </strong>
              ?
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-3">Estado actual:</p>
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    confirmModal.usuario.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {confirmModal.usuario.isActive ? "Activo" : "Inactivo"}
                </span>
                <span className="text-gray-600">→</span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    confirmModal.newStatus
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {confirmModal.newStatus ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {confirmModal.error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {confirmModal.error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() =>
                  setConfirmModal({
                    visible: false,
                    usuario: null,
                    newStatus: false,
                    isLoading: false,
                    error: null,
                  })
                }
                disabled={confirmModal.isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                isLoading={confirmModal.isLoading}
                disabled={confirmModal.isLoading}
                onClick={handleConfirmStatus}
                className="flex-1"
              >
                {confirmModal.newStatus ? "Activar" : "Desactivar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        visible={logoutModal.visible}
        usuario={logoutModal.usuario}
        isLoading={logoutModal.isLoading}
        error={logoutModal.error}
        successMessage={logoutModal.successMessage}
        onConfirm={handleConfirmLogout}
        onCancel={() =>
          setLogoutModal({
            visible: false,
            usuario: null,
            isLoading: false,
            error: null,
            successMessage: null,
          })
        }
      />
    </div>
  );
};

export default AdminDashboard;
