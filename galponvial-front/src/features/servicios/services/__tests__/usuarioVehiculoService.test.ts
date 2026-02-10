import { usuarioVehiculoService } from '../usuarioVehiculoService';
import { apiClient } from '@/services/api';
import { UsuarioVehiculoResponse, UsuarioVehiculoRelacion } from '../../types';

jest.mock('@/services/api');

describe('usuarioVehiculoService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all usuario-vehículo relationships with pagination', async () => {
      const mockData: UsuarioVehiculoResponse = {
        success: true,
        data: {
          data: [
            {
              id_usuario_vehiculo: 1,
              id_vehiculo: 1,
              id_usuario: '12345678',
              fecha_desde: '2026-02-01',
              fecha_hasta: null,
              usuario: {
                dni: '12345678',
                nombre: 'Juan',
                apellido: 'Pérez',
                email: 'juan@example.com',
                password: 'hashed',
                isActive: true,
                tokenVersion: 0,
                fecha_alta: '2026-02-01',
                fecha_baja: null,
                usuarioRoles: [],
              },
              vehiculo: {
                id_vehiculo: 1,
                codigo: 'VEH-001',
                nombre: 'Vehículo 1',
                marca: 'Toyota',
                modelo: 'Corolla',
                anio: 2020,
                status: 'disponible',
                uso_combustible: 15,
                uso_km: 0.5,
                tipo_vehiculo: 'sedan',
                eliminado: false,
                created_at: '2026-02-01T00:00:00Z',
              },
            },
          ],
          total: 1,
          page: 1,
          pageSize: 10,
        },
        message: '1 relación encontrada',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await usuarioVehiculoService.getAll(1, 10);

      expect(result).toEqual(mockData);
      expect(apiClient.get).toHaveBeenCalledWith('/vehiculos/usuario-vehiculo', {
        params: { page: 1, pageSize: 10 },
      });
    });

    it('should use default pagination parameters', async () => {
      const mockData: UsuarioVehiculoResponse = {
        success: true,
        data: {
          data: [],
          total: 0,
          page: 1,
          pageSize: 10,
        },
        message: 'No relationships found',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

      await usuarioVehiculoService.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/vehiculos/usuario-vehiculo', {
        params: { page: 1, pageSize: 10 },
      });
    });
  });

  describe('getById', () => {
    it('should fetch a single usuario-vehículo relationship by ID', async () => {
      const mockRelacion: UsuarioVehiculoRelacion = {
        id_usuario_vehiculo: 1,
        id_vehiculo: 1,
        id_usuario: '12345678',
        fecha_desde: '2026-02-01',
        fecha_hasta: null,
        usuario: {
          dni: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@example.com',
          password: 'hashed',
          isActive: true,
          tokenVersion: 0,
          fecha_alta: '2026-02-01',
          fecha_baja: null,
          usuarioRoles: [],
        },
        vehiculo: {
          id_vehiculo: 1,
          codigo: 'VEH-001',
          nombre: 'Vehículo 1',
          marca: 'Toyota',
          modelo: 'Corolla',
          anio: 2020,
          status: 'disponible',
          uso_combustible: 15,
          uso_km: 0.5,
          tipo_vehiculo: 'sedan',
          eliminado: false,
          created_at: '2026-02-01T00:00:00Z',
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRelacion });

      const result = await usuarioVehiculoService.getById(1);

      expect(result).toEqual(mockRelacion);
      expect(apiClient.get).toHaveBeenCalledWith('/vehiculos/usuario-vehiculo/1');
    });
  });

  describe('desasignarRelacion', () => {
    it('should delete a usuario-vehículo relationship', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({ data: undefined });

      await usuarioVehiculoService.desasignarRelacion(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/vehiculos/usuario-vehiculo/1');
    });

    it('should handle error when deleting fails', async () => {
      const errorMessage = 'Error deleting relationship';
      (apiClient.delete as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(usuarioVehiculoService.desasignarRelacion(1)).rejects.toThrow(errorMessage);
    });
  });

  describe('asignarVehiculo', () => {
    it('should assign a vehicle to a user', async () => {
      const mockRelacion: UsuarioVehiculoRelacion = {
        id_usuario_vehiculo: 1,
        id_vehiculo: 1,
        id_usuario: '12345678',
        fecha_desde: '2026-02-10',
        fecha_hasta: null,
        usuario: {
          dni: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@example.com',
          password: 'hashed',
          isActive: true,
          tokenVersion: 0,
          fecha_alta: '2026-02-01',
          fecha_baja: null,
          usuarioRoles: [],
        },
        vehiculo: {
          id_vehiculo: 1,
          codigo: 'VEH-001',
          nombre: 'Vehículo 1',
          marca: 'Toyota',
          modelo: 'Corolla',
          anio: 2020,
          status: 'disponible',
          uso_combustible: 15,
          uso_km: 0.5,
          tipo_vehiculo: 'sedan',
          eliminado: false,
          created_at: '2026-02-01T00:00:00Z',
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelacion });

      const result = await usuarioVehiculoService.asignarVehiculo('12345678', 1);

      expect(result).toEqual(mockRelacion);
      expect(apiClient.post).toHaveBeenCalledWith(
        '/vehiculos/assign',
        expect.objectContaining({
          dni: '12345678',
          id_vehiculo: 1,
        })
      );
    });

    it('should handle error when assigning fails', async () => {
      const errorMessage = 'Vehicle already assigned';
      (apiClient.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(usuarioVehiculoService.asignarVehiculo('12345678', 1)).rejects.toThrow(
        errorMessage
      );
    });
  });
});
