import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import type {
  User,
  Role,
  Permission,
  CreateUserDto,
  UpdateUserDto,
  PaginatedResponse,
  RolePermissionStructure,
} from "../types";
import type { ObjectServiceResponse } from "@/shared/types/common-types";

export const usuariosService = {
  // User Management
  getAll: async (
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get(API_ENDPOINTS.USUARIOS.LIST, {
      params: { page, pageSize },
    });
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(API_ENDPOINTS.USUARIOS.DETAIL(id));
    return data;
  },

  create: async (usuario: CreateUserDto): Promise<User> => {
    const { data } = await apiClient.post(
      API_ENDPOINTS.USUARIOS.CREATE,
      usuario,
    );
    return data;
  },

  update: async (id: string, usuario: UpdateUserDto): Promise<User> => {
    const { data } = await apiClient.put(
      API_ENDPOINTS.USUARIOS.UPDATE(id),
      usuario,
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USUARIOS.DELETE(id));
  },

  updateByDni: async (dni: number, data: UpdateUserDto): Promise<User> => {
    const { data: response } = await apiClient.put(`/usuario/${dni}`, data);
    return response.data || response;
  },

  updateRol: async (
    dni: number,
    rol: "user" | "admin" | "superuser",
  ): Promise<User> => {
    const { data: response } = await apiClient.patch(`/usuario/addRol/${dni}`, {
      rol,
    });
    return response.data || response;
  },

  updateStatus: async (dni: number, isActive: boolean): Promise<User> => {
    // Ensure dni is a number
    const dniNumber = Number(dni);
    if (isNaN(dniNumber)) {
      throw new Error("DNI must be a valid number");
    }
    const { data: response } = await apiClient.put("/usuario", {
      dni: dniNumber,
      isActive,
    });
    return response.data || response;
  },

  toggleActive: async (id: string): Promise<User> => {
    const { data } = await apiClient.patch(`/usuarios/${id}/toggle-active`);
    return data;
  },

  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    await apiClient.post(`/usuarios/${id}/reset-password`, { newPassword });
  },

  logoutUser: async (email: string): Promise<ObjectServiceResponse<{ revoked: boolean }>> => {
    const { data } = await apiClient.post("/usuario/logout", { email });
    return data;
  },

  // Role Management
  getAllRoles: async (): Promise<Role[]> => {
    const { data } = await apiClient.get("/roles");
    return data;
  },

  getRoleById: async (id: string): Promise<Role> => {
    const { data } = await apiClient.get(`/roles/${id}`);
    return data;
  },

  createRole: async (role: Omit<Role, "id">): Promise<Role> => {
    const { data } = await apiClient.post("/roles", role);
    return data;
  },

  updateRole: async (id: string, role: Partial<Role>): Promise<Role> => {
    const { data } = await apiClient.put(`/roles/${id}`, role);
    return data;
  },

  deleteRole: async (id: string): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
  },

  // Permission Management
  getAllPermissions: async (): Promise<Permission[]> => {
    const { data } = await apiClient.get("/permisos");
    return data;
  },

  getPermissionsByModule: async (modulo: string): Promise<Permission[]> => {
    const { data } = await apiClient.get(`/permisos?modulo=${modulo}`);
    return data;
  },

  /**
   * Get the structure of roles and their associated permissions
   * Returns an array of role-permission combinations
   */
  getRolePermissionStructure: async (): Promise<RolePermissionStructure> => {
    const { data } = await apiClient.get<ObjectServiceResponse<RolePermissionStructure>>(
      "/usuario/roles/estructura"
    );
    return Array.isArray(data.data) ? data.data : [];
  },
};
