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
 * Valid role names - Must match backend values
 */
export type UserRole = 'user' | 'admin' | 'superuser' | 'super-admin' | 'superadmin';

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
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  password?: string;
  rol_ids?: number[];
  activo?: boolean;
}

/**
 * Single role-permission combination from the backend
 */
export interface RolePermissionItem {
  id: number;
  permisos: ValidPermissions[];
  rol: UserRole;
}

/**
 * Structure of roles and their associated permissions from the backend
 */
export type RolePermissionStructure = RolePermissionItem[];

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
