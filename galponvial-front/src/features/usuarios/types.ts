/**
 * User and Admin Panel Types
 */

/**
 * Valid permission values in the system
 */
export enum ValidPermissions {
  ALMACEN_TALLER_READ = 'almacen-taller:read',
  ALMACEN_TALLER_WRITE = 'almacen-taller:write',
  ALMACEN_COMUN_READ = 'almacen-comun:read',
  ALMACEN_COMUN_WRITE = 'almacen-comun:write',
  ALL_READ = 'all:read',
  ALL_WRITE = 'all:write',
}

/**
 * Valid role names
 */
export type UserRole = 'usuario' | 'admin' | 'super-admin';

export interface User {
  dni: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  permisos: Permission[];
  isActive: boolean;
  fechaCreacion: string;
}

export interface UserAuth {
  dni: number;
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
  rol?: UserRole;
  permisos?: ValidPermissions[];
  activo?: boolean;
}

/**
 * Structure of roles and their associated permissions from the backend
 */
export interface RolePermissionStructure {
  [key: string]: {
    permisos: ValidPermissions[];
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
