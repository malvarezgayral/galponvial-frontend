import React, { useState, useEffect } from 'react';
import { useUsuariosStore } from '../store';
import { Button } from '@/shared/ui/Button';
import type { CreateUserDto, UpdateUserDto } from '../types';

const UserFormModal: React.FC = () => {
  const {
    usuarioSeleccionado,
    modoEdicion,
    isLoading,
    setModalAbierto,
    setUsuarioSeleccionado,
    crearUsuario,
    actualizarUsuario,
    fetchRoles,
  } = useUsuariosStore();

  const [formData, setFormData] = useState<{
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: 'usuario' | 'admin' | 'super-admin';
  }>({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'usuario',
  });

  const [passwordInputType, setPasswordInputType] = useState<'password' | 'text'>('password');

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (modoEdicion && usuarioSeleccionado) {
      setFormData({
        dni: usuarioSeleccionado.dni ? String(usuarioSeleccionado.dni) : '',
        nombre: usuarioSeleccionado.nombre,
        apellido: usuarioSeleccionado.apellido,
        email: usuarioSeleccionado.email,
        password: '',
        rol: usuarioSeleccionado.rol,
      });
    } else {
      setFormData({
        dni: '',
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol: 'usuario',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate DNI
    const dniNum = parseInt(formData.dni, 10);
    if (!formData.dni || dniNum < 1000000 || dniNum > 99999999) {
      alert('DNI debe ser un número entre 1000000 y 99999999');
      return;
    }

    if (modoEdicion && usuarioSeleccionado) {
      const updateData: UpdateUserDto = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        rol: formData.rol,
      };

      if (formData.password) {
        // If password is provided, include it (only for super-admin)
        updateData.password = formData.password;
      }

      await actualizarUsuario(usuarioSeleccionado.id, updateData);
    } else {
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

      await crearUsuario(createData);
    }

    setModalAbierto(false);
    setUsuarioSeleccionado(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
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

          {/* Rol - Only show in edit mode */}
          {modoEdicion && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-navbar-nav)] focus:border-transparent"
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                * Solo super-admins pueden crear otros admins
              </p>
            </div>
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
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              disabled={isLoading}
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
