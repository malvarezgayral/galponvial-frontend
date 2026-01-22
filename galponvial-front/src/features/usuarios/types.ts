/**
 * User and Admin Panel Types
 */

export interface User {
  dni: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'usuario' | 'admin' | 'super-admin';
  permisos: Permission[];
  isActive: boolean;
  fechaCreacion: string;
}

export interface UserAuth {
  email: string;
  rol: string;
}

export interface Role {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: Permission[];
  activo: boolean;
}

export interface Permission {
  id: string;
  nombre: string;
  descripcion: string;
  modulo: 'vehiculos' | 'almacen' | 'usuarios' | 'auditoria' | 'admin';
  accion: 'crear' | 'leer' | 'actualizar' | 'eliminar';
}

export interface CreateUserDto {
  dni: number;
  email: string;
  nombre: string;
  apellido: string;
  password: string;
}

export interface UpdateUserDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  password?: string;
  rol?: 'usuario' | 'admin' | 'super-admin';
  permisos?: Permission[];
  activo?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
