import React, { useState, useEffect } from 'react';
import { useUsuariosStore } from '../store';
import { Button } from '@/shared/ui/Button';
import type { CreateUserDto, UpdateUserDto, ValidPermissions, RolePermissionStructure } from '../types';
import { usuariosService } from '../services/usuariosService';

const UserFormModal: React.FC = () => {
  const {
    usuarioSeleccionado,
    modoEdicion,
    isLoading,
    setModalAbierto,
    setUsuarioSeleccionado,
    crearUsuario,
    actualizarPorDni,
    actualizarRol,
    fetchRoles,
  } = useUsuariosStore();

  const [formData, setFormData] = useState<{
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: 'usuario' | 'admin' | 'super-admin' | 'superuser';
    permisos: ValidPermissions[];
  }>({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'usuario',
    permisos: [],
  });

  const [passwordInputType, setPasswordInputType] = useState<'password' | 'text'>('password');
  const [rolePermissionStructure, setRolePermissionStructure] = useState<RolePermissionStructure>({});
  const [availablePermissions, setAvailablePermissions] = useState<ValidPermissions[]>([]);
  const [loadingStructure, setLoadingStructure] = useState(false);

  // Load role/permission structure on mount
  useEffect(() => {
    const loadStructure = async () => {
      try {
        setLoadingStructure(true);
        const structure = await usuariosService.getRolePermissionStructure();
        setRolePermissionStructure(structure);
      } catch (error) {
        console.error('Error loading role/permission structure:', error);
      } finally {
        setLoadingStructure(false);
      }
    };

    loadStructure();
    fetchRoles();
  }, [fetchRoles]);

  // Update available permissions when role changes
  useEffect(() => {
    const roleKey = formData.rol;
    const permissions = rolePermissionStructure[roleKey]?.permisos || [];
    setAvailablePermissions(permissions);

    // Clear selected permissions if not available in new role
    const validPermissions = formData.permisos.filter((p) =>
      permissions.includes(p)
    );
    setFormData((prev) => ({
      ...prev,
      permisos: validPermissions,
    }));
  }, [formData.rol, rolePermissionStructure]);

  useEffect(() => {
    if (modoEdicion && usuarioSeleccionado) {
      setFormData({
        dni: usuarioSeleccionado.dni ? String(usuarioSeleccionado.dni) : '',
        nombre: usuarioSeleccionado.nombre,
        apellido: usuarioSeleccionado.apellido,
        email: usuarioSeleccionado.email,
        password: '',
        rol: usuarioSeleccionado.rol,
        permisos: usuarioSeleccionado.permisos?.map((p) => p.nombre as ValidPermissions) || [],
      });
    } else {
      setFormData({
        dni: '',
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol: 'usuario',
        permisos: [],
      });
    }
  }, [modoEdicion, usuarioSeleccionado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionToggle = (permission: ValidPermissions) => {
    setFormData((prev) => {
      const isSelected = prev.permisos.includes(permission);
      let newPermisos = isSelected
        ? prev.permisos.filter((p) => p !== permission)
        : [...prev.permisos, permission];

      // Auto-convert to all:read if both read permissions are selected
      if (
        !isSelected &&
        newPermisos.includes('almacen-taller:read' as ValidPermissions) &&
        newPermisos.includes('almacen-comun:read' as ValidPermissions)
      ) {
        newPermisos = newPermisos.filter((p) => p !== 'almacen-taller:read' && p !== 'almacen-comun:read');
        newPermisos.push('all:read' as ValidPermissions);
      }

      // Auto-convert to all:write if both write permissions are selected
      if (
        !isSelected &&
        newPermisos.includes('almacen-taller:write' as ValidPermissions) &&
        newPermisos.includes('almacen-comun:write' as ValidPermissions)
      ) {
        newPermisos = newPermisos.filter((p) => p !== 'almacen-taller:write' && p !== 'almacen-comun:write');
        newPermisos.push('all:write' as ValidPermissions);
      }

      return {
        ...prev,
        permisos: newPermisos,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('modoEdicion:', modoEdicion);
    console.log('usuarioSeleccionado:', usuarioSeleccionado);

    // Validate DNI
    const dniNum = parseInt(formData.dni, 10);
    if (!formData.dni || dniNum < 1000000 || dniNum > 99999999) {
      alert('DNI debe ser un número entre 1000000 y 99999999');
      return;
    }

    if (modoEdicion && usuarioSeleccionado) {
      // Edit mode with dual-endpoint logic
      const nombreChanged = usuarioSeleccionado.nombre !== formData.nombre;
      const apellidoChanged = usuarioSeleccionado.apellido !== formData.apellido;
      const emailChanged = usuarioSeleccionado.email !== formData.email;
      const passwordChanged = formData.password.length > 0;
      const rolChanged = usuarioSeleccionado.rol !== formData.rol;
      
      // Fix: Handle null/undefined permisos array
      const usuarioPermisosString = (usuarioSeleccionado.permisos || [])
        .map((p) => (typeof p === 'string' ? p : p.nombre))
        .sort()
        .join(',');
      const formPermisosString = formData.permisos.sort().join(',');
      const permisosChanged = usuarioPermisosString !== formPermisosString;

      console.log('Changes detected:');
      console.log('- nombreChanged:', nombreChanged);
      console.log('- apellidoChanged:', apellidoChanged);
      console.log('- emailChanged:', emailChanged);
      console.log('- passwordChanged:', passwordChanged);
      console.log('- rolChanged:', rolChanged);
      console.log('- permisosChanged:', permisosChanged);

      // Check if non-rol fields changed
      const otherFieldsChanged = nombreChanged || apellidoChanged || emailChanged || passwordChanged || permisosChanged;

      let updateSuccess = true;
      let roleUpdateSuccess = true;

      try {
        // Call updateByDni if other fields changed
        if (otherFieldsChanged) {
          const updateData: UpdateUserDto = {};

          if (nombreChanged) updateData.nombre = formData.nombre;
          if (apellidoChanged) updateData.apellido = formData.apellido;
          if (emailChanged) updateData.email = formData.email;
          if (passwordChanged) updateData.password = formData.password;
          if (permisosChanged) updateData.permisos = formData.permisos;

          console.log('Calling actualizarPorDni with:', updateData);
          const result = await actualizarPorDni(dniNum, updateData);
          updateSuccess = result !== null;

          if (!updateSuccess) {
            alert('Error al actualizar los datos del usuario');
          }
        }

        // Call updateRol if rol changed
        if (rolChanged) {
          console.log('Calling actualizarRol with:', formData.rol);
          const result = await actualizarRol(dniNum, formData.rol);
          roleUpdateSuccess = result !== null;

          if (!roleUpdateSuccess) {
            alert('Error al actualizar el rol del usuario');
          }
        }

        // If nothing changed, show message
        if (!otherFieldsChanged && !rolChanged) {
          alert('No hay cambios para guardar');
          return;
        }

        // Close modal only if at least one update was successful
        if (updateSuccess || roleUpdateSuccess) {
          alert('Usuario actualizado correctamente');
          setModalAbierto(false);
          setUsuarioSeleccionado(null);
        }
      } catch (error) {
        console.error('Error updating user:', error);
        alert(`Error al actualizar el usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    } else {
      // Create mode
      if (!formData.password) {
        alert('La contraseña es requerida para crear un nuevo usuario');
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
        setModalAbierto(false);
        setUsuarioSeleccionado(null);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full my-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
          {modoEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h2>

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

          {/* Rol - Always show, but disabled in create mode */}
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
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Super Admin</option>
              <option value="superuser">Super User (Superuser)</option>
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
                    Permisos para {formData.rol}
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-40 overflow-y-auto">
                    {availablePermissions.length > 0 ? (
                      <div className="space-y-2">
                        {availablePermissions.map((permission) => (
                          <label key={permission} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.permisos.includes(permission)}
                              onChange={() => handlePermissionToggle(permission)}
                              className="w-4 h-4 text-[#378AFE] rounded border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {getPermissionLabel(permission)}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No hay permisos disponibles para este rol</p>
                    )}
                  </div>

                  {/* Selected Permissions Badges */}
                  {formData.permisos.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.permisos.map((permission) => (
                        <div
                          key={permission}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-[#E3F2FD] text-[#0962DE] text-xs rounded-full border border-[#88BAFF]"
                        >
                          <span>{getPermissionLabel(permission)}</span>
                          <button
                            type="button"
                            onClick={() => handlePermissionToggle(permission)}
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
