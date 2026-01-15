import { vehiculosService } from '../services/vehiculosService';
import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import type { Vehiculo } from '../types';

jest.mock('@/services/api');
jest.mock('@/services/apiEndpoints');

describe('vehiculosService', () => {
  const mockVehiculo: Vehiculo = {
    id: '1',
    modelo: 'Toyota',
    marca: 'Corolla',
    anio: 2023,
    patente: 'ABC-123',
    estado: 'disponible',
    fechaCompra: '2023-01-01',
    fechaCreacion: '2023-01-01',
    ultimaModificacion: '2023-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all vehiculos', async () => {
      const mockData = [mockVehiculo];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await vehiculosService.getAll();

      expect(result).toEqual(mockData);
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.VEHICULOS.LIST);
    });

    it('should handle error when fetching vehiculos', async () => {
      const error = new Error('Network error');
      (apiClient.get as jest.Mock).mockRejectedValue(error);

      await expect(vehiculosService.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('getById', () => {
    it('should fetch vehiculo by id', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockVehiculo });

      const result = await vehiculosService.getById('1');

      expect(result).toEqual(mockVehiculo);
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.VEHICULOS.DETAIL('1'));
    });
  });

  describe('create', () => {
    it('should create a new vehiculo', async () => {
      const newVehiculo = {
        modelo: 'Honda',
        marca: 'Civic',
        anio: 2023,
        patente: 'XYZ-789',
        estado: 'disponible',
        fechaCompra: '2023-01-01',
      };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockVehiculo });

      const result = await vehiculosService.create(newVehiculo);

      expect(result).toEqual(mockVehiculo);
      expect(apiClient.post).toHaveBeenCalledWith(
        API_ENDPOINTS.VEHICULOS.CREATE,
        newVehiculo
      );
    });
  });

  describe('update', () => {
    it('should update a vehiculo', async () => {
      const updates: Partial<Vehiculo> = { modelo: 'Updated Model' };
      (apiClient.put as jest.Mock).mockResolvedValue({ data: mockVehiculo });

      const result = await vehiculosService.update('1', updates);

      expect(result).toEqual(mockVehiculo);
      expect(apiClient.put).toHaveBeenCalledWith(
        API_ENDPOINTS.VEHICULOS.UPDATE('1'),
        updates
      );
    });
  });

  describe('delete', () => {
    it('should delete a vehiculo', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({});

      await vehiculosService.delete('1');

      expect(apiClient.delete).toHaveBeenCalledWith(API_ENDPOINTS.VEHICULOS.DELETE('1'));
    });
  });
});
