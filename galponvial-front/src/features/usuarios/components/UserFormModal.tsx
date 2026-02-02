import React, { useState, useEffect } from 'react';
import { useUsuariosStore } from '../store';
import { Button } from '@/shared/ui/Button';
import type { CreateUserDto, UpdateUserDto, ValidPermissions, RolePermissionItem } from '../types';
import type { UserRole } from '../types';

const UserFormModal: React.FC = () => {
  const {
    usuarioSeleccionado,
    modoEdicion,
    isLoading,
    rolePermissionStructure,
    loadingStructure,
    setModalAbierto,
    setUsuarioSeleccionado,
    crearUsuario,
    actualizarPorDni,
    fetchRolePermissionStructure,
  } = useUsuariosStore();

  const [formData, setFormData] = useState<{
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: UserRole;
    permisos: number[];
  }>({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'user',
    permisos: [],
  });

  const [passwordInputType, setPasswordInputType] = useState<'password' | 'text'>('password');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load role/permission structure on mount
  useEffect(() => {
    fetchRolePermissionStructure();
  }, [fetchRolePermissionStructure]);

  // Get available permissions for the selected role
  const getAvailablePermissionsForRole = (): RolePermissionItem[] => {
    return Array.isArray(rolePermissionStructure)
      ? rolePermissionStructure.filter((item) => item.rol === formData.rol)
      : [];
  };

  // Initialize form when editing a user
  // This effect initializes the form with user data when entering edit mode
  // The setState call is safe here as it's synchronizing with external state (usuarioSeleccionado)
  useEffect(() => {
    if (modoEdicion && usuarioSeleccionado) {
      setFormData({
        dni: usuarioSeleccionado.dni ? String(usuarioSeleccionado.dni) : '',
        nombre: usuarioSeleccionado.nombre,
        apellido: usuarioSeleccionado.apellido,
        email: usuarioSeleccionado.email,
        password: '',
        rol: usuarioSeleccionado.rol,
        permisos: [],
      });
    } else {
      setFormData({
        dni: '',
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol: 'user',
        permisos: [],
      });
    }
  }, [modoEdicion, usuarioSeleccionado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'rol') {
      setFormData((prev) => ({
        ...prev,
        [name]: value as UserRole,
        permisos: [], // Clear selected permissions when role changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    setFormData((prev) => {
      const isSelected = prev.permisos.includes(permissionId);
      return {
        ...prev,
        permisos: isSelected
          ? prev.permisos.filter((id) => id !== permissionId)
          : [...prev.permisos, permissionId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);

    // Validate DNI
    const dniNum = parseInt(formData.dni, 10);
    if (!formData.dni || dniNum < 1000000 || dniNum > 99999999) {
      setFeedbackMessage({
        type: 'error',
        text: 'DNI debe ser un número entre 1000000 y 99999999',
      });
      return;
    }

    if (modoEdicion && usuarioSeleccionado) {
      // Edit mode - Single request with rol_ids
      try {
        const updateData: UpdateUserDto = {};
        let hasChanges = false;

        if (usuarioSeleccionado.nombre !== formData.nombre) {
          updateData.nombre = formData.nombre;
          hasChanges = true;
        }
        if (usuarioSeleccionado.apellido !== formData.apellido) {
          updateData.apellido = formData.apellido;
          hasChanges = true;
        }
        if (usuarioSeleccionado.email !== formData.email) {
          updateData.email = formData.email;
          hasChanges = true;
        }
        if (formData.password.length > 0) {
          updateData.password = formData.password;
          hasChanges = true;
        }
        if (formData.permisos.length > 0) {
          updateData.rol_ids = formData.permisos;
          hasChanges = true;
        }

        if (!hasChanges) {
          setFeedbackMessage({
            type: 'error',
            text: 'No hay cambios para guardar',
          });
          return;
        }

        const result = await actualizarPorDni(dniNum, updateData);
        if (result) {
          setFeedbackMessage({
            type: 'success',
            text: 'Usuario actualizado correctamente',
          });
          setTimeout(() => {
            setModalAbierto(false);
            setUsuarioSeleccionado(null);
          }, 1500);
        } else {
          setFeedbackMessage({
            type: 'error',
            text: 'Error al actualizar el usuario',
          });
        }
      } catch (error) {
        console.error('Error updating user:', error);
        setFeedbackMessage({
          type: 'error',
          text: `Error al actualizar el usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        });
      }
    } else {
      // Create mode
      if (!formData.password) {
        setFeedbackMessage({
          type: 'error',
          text: 'La contraseña es requerida para crear un nuevo usuario',
        });
        return;
      }

      const createData: CreateUserDto = {
        dni: dniNum,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
      };

      const result = await crearUsuario(createData);
      if (result) {
        setFeedbackMessage({
          type: 'success',
          text: 'Usuario creado correctamente',
        });
        setTimeout(() => {
          setModalAbierto(false);
          setUsuarioSeleccionado(null);
        }, 1500);
      } else {
        setFeedbackMessage({
          type: 'error',
          text: 'Error al crear el usuario',
        });
      }
    }
  };

  const getPermissionLabel = (permission: ValidPermissions): string => {
    const labels: Record<ValidPermissions, string> = {
      'almacen-taller:read': 'Almacén Taller - Lectura',
      'almacen-taller:write': 'Almacén Taller - Escritura',
      'almacen-comun:read': 'Almacén Común - Lectura',
      'almacen-comun:write': 'Almacén Común - Escritura',
      'all:read': 'Todos - Lectura',
      'all:write': 'Todos - Escritura',
    };
    return labels[permission] || permission;
  };

  const getRoleLabel = (rol: UserRole): string => {
    const labels: Record<UserRole, string> = {
      'user': 'Usuario',
      'admin': 'Admin',
      'superuser': 'Super usuario',
    };
    return labels[rol] || rol;
  };

  const availablePermissions = getAvailablePermissionsForRole();
  const selectedPermissionsDetails = rolePermissionStructure.filter((item) =>
    formData.permisos.includes(item.id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full my-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
          {modoEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h2>

        {/* Feedback Message */}
        {feedbackMessage && (
          <div
            className={`mb-4 p-4 rounded-lg text-sm font-medium ${
              feedbackMessage.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {feedbackMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* DNI */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DNI
            </label>
            <input
              type="number"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              required
              disabled={modoEdicion}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-navbar-nav)] focus:border-transparent disabled:bg-gray-100"
              placeholder="37766524"
              min="1000000"
              max="99999999"
            />
            <p className="text-xs text-gray-500 mt-1">Debe ser un número entre 1000000 y 99999999</p>
          </div>

          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-navbar-nav)] focus:border-transparent"
              placeholder="Juan"
            />
          </div>

          {/* Apellido */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-navbar-nav)] focus:border-transparent"
              placeholder="Pérez"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-navbar-nav)] focus:border-transparent"
              placeholder="juan@example.com"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {modoEdicion ? 'Contraseña (opcional)' : 'Contraseña'}
            </label>
            <div className="relative">
              <input
                type={passwordInputType}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!modoEdicion}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-navbar-nav)] focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() =>
                  setPasswordInputType(passwordInputType === 'password' ? 'text' : 'password')
                }
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {passwordInputType === 'password' ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Rol */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              disabled={!modoEdicion}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-navbar-nav)] focus:border-transparent disabled:bg-gray-100"
            >
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
              <option value="superuser">Super usuario</option>
            </select>
            {modoEdicion && (
              <p className="text-xs text-gray-500 mt-1">
                * Solo super-admins pueden crear otros admins
              </p>
            )}
          </div>

          {/* Permisos - Multi-select (Only in edit mode) */}
          {modoEdicion && (
            <>
              {!loadingStructure && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permisos para {getRoleLabel(formData.rol)}
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto">
                    {availablePermissions.length > 0 ? (
                      <div className="space-y-2">
                        {availablePermissions.map((permission) => (
                          <label key={permission.id} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.permisos.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="w-4 h-4 text-[#378AFE] rounded border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {permission.permisos.map((p) => getPermissionLabel(p)).join(', ')}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No hay permisos disponibles para este rol</p>
                    )}
                  </div>

                  {/* Selected Permissions Badges */}
                  {selectedPermissionsDetails.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedPermissionsDetails.map((permission) => (
                        <div
                          key={permission.id}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-[#E3F2FD] text-[#0962DE] text-xs rounded-full border border-[#88BAFF]"
                        >
                          <span>{permission.permisos.map((p) => getPermissionLabel(p)).join(', ')}</span>
                          <button
                            type="button"
                            onClick={() => handlePermissionToggle(permission.id)}
                            className="ml-1 hover:opacity-70"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => {
                setModalAbierto(false);
                setUsuarioSeleccionado(null);
              }}
              disabled={isLoading || loadingStructure}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading || loadingStructure}
              disabled={isLoading || loadingStructure}
              className="flex-1"
            >
              {modoEdicion ? 'Guardar Cambios' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
