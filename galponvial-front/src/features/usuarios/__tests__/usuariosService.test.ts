import { usuariosService } from '../services/usuariosService';
import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';

jest.mock('@/services/api');

describe('usuariosService', () => {
  const mockUser = {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@example.com',
    rol: 'usuario' as const,
    permisos: [],
    activo: true,
    fechaCreacion: '2026-01-01',
    ultimaModificacion: '2026-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Management', () => {
    it('should fetch paginated users', async () => {
      const mockData = {
        data: [mockUser],
        total: 10,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await usuariosService.getAll(1, 10);

      expect(result).toEqual(mockData);
      expect(apiClient.get).toHaveBeenCalled();
    });

    it('should fetch user by id', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockUser });

      const result = await usuariosService.getById('1');

      expect(result).toEqual(mockUser);
    });

    it('should create a new user', async () => {
      const newUser = {
        nombre: 'Carlos',
        apellido: 'López',
        email: 'carlos@example.com',
        password: 'password123',
        rol: 'usuario' as const,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockUser });

      const result = await usuariosService.create(newUser);

      expect(result).toEqual(mockUser);
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.USUARIOS.CREATE, newUser);
    });

    it('should toggle user active status', async () => {
      const updatedUser = { ...mockUser, activo: false };
      (apiClient.patch as jest.Mock).mockResolvedValue({ data: updatedUser });

      const result = await usuariosService.toggleActive('1');

      expect(result.activo).toBe(false);
    });

    it('should reset user password', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({});

      await usuariosService.resetPassword('1', 'newPassword123');

      expect(apiClient.post).toHaveBeenCalled();
    });

    it('should delete a user', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({});

      await usuariosService.delete('1');

      expect(apiClient.delete).toHaveBeenCalledWith(API_ENDPOINTS.USUARIOS.DELETE('1'));
    });
  });

  describe('Role Management', () => {
    const mockRole = {
      id: '1',
      nombre: 'Admin',
      descripcion: 'Administrador del sistema',
      permisos: [],
      activo: true,
    };

    it('should fetch all roles', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [mockRole] });

      const result = await usuariosService.getAllRoles();

      expect(result).toEqual([mockRole]);
    });

    it('should create a new role', async () => {
      const newRole = {
        nombre: 'Editor',
        descripcion: 'Editor de contenido',
        permisos: [],
        activo: true,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRole });

      const result = await usuariosService.createRole(newRole);

      expect(result).toEqual(mockRole);
    });

    it('should delete a role', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({});

      await usuariosService.deleteRole('1');

      expect(apiClient.delete).toHaveBeenCalled();
    });
  });

  describe('Permission Management', () => {
    const mockPermission = {
      id: '1',
      nombre: 'Ver vehículos',
      descripcion: 'Permiso para ver vehículos',
      modulo: 'vehiculos' as const,
      accion: 'leer' as const,
    };

    it('should fetch all permissions', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [mockPermission] });

      const result = await usuariosService.getAllPermissions();

      expect(result).toEqual([mockPermission]);
    });

    it('should fetch permissions by module', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [mockPermission] });

      const result = await usuariosService.getPermissionsByModule('vehiculos');

      expect(result).toEqual([mockPermission]);
    });
  });
});
