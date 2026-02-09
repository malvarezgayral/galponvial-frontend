import { vehiculosService } from '../services/vehiculosService';
import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import type { Vehiculo, CreateVehiculoPayload } from '../types';

jest.mock('@/services/api');
jest.mock('@/services/apiEndpoints');

describe('vehiculosService', () => {
  const mockVehiculo: Vehiculo = {
    id: '1',
    codigo: 'JWLF89-X',
    nombre: 'Camioneta Toyota Last Gen 4',
    modelo: 'D-max',
    marca: 'Toyota',
    anio: 2000,
    tipo_vehiculo: 'camioneta',
    status: 'disponible',
    infoAdicional: {
      numero_serie: 8008859404,
      licencia_conductor: 'LC887',
      color: 'rojo',
      seguro_empresa: 'Seguros Pernada S.A',
      poliza: 'unapolizadealguntipo',
      sector: {
        id_sector: 2,
        nombre: 'Sector 2',
      },
    },
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
    it('should create a new vehiculo with correct payload structure', async () => {
      const newVehiculo: CreateVehiculoPayload = {
        codigo: 'JWLF89-X',
        nombre: 'Camioneta Toyota Last Gen 4',
        marca: 'Toyota',
        modelo: 'D-max',
        anio: 2000,
        tipo_vehiculo: 'camioneta',
        status: 'disponible',
        infoAdicional: {
          numero_serie: 8008859404,
          licencia_conductor: 'LC887',
          color: 'rojo',
          seguro_empresa: 'Seguros Pernada S.A',
          poliza: 'unapolizadealguntipo',
          sector: {
            id_sector: 2,
            nombre: 'Sector 2',
          },
        },
      };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockVehiculo });

      const result = await vehiculosService.create(newVehiculo);

      expect(result).toEqual(mockVehiculo);
      // Verify that the payload was transformed to send id_sector_pertenencia
      expect(apiClient.post).toHaveBeenCalledWith(
        API_ENDPOINTS.VEHICULOS.CREATE,
        expect.objectContaining({
          infoAdicional: expect.objectContaining({
            id_sector_pertenencia: 2,
          }),
        })
      );
    });
  });

  describe('update', () => {
    it('should update a vehiculo', async () => {
      const updates: Partial<Vehiculo> = { nombre: 'Updated Name' };
      (apiClient.patch as jest.Mock).mockResolvedValue({ data: mockVehiculo });

      const result = await vehiculosService.update('1', updates);

      expect(result).toEqual(mockVehiculo);
      expect(apiClient.patch).toHaveBeenCalledWith(
        API_ENDPOINTS.VEHICULOS.UPDATE('1'),
        expect.any(Object)
      );
    });

    it('should transform sector object to id_sector_pertenencia in update payload', async () => {
      const updates: Partial<Vehiculo> = {
        infoAdicional: {
          numero_serie: 123,
          licencia_conductor: 'LC123',
          color: 'azul',
          seguro_empresa: 'Seguros',
          poliza: 'POL123',
          sector: {
            id_sector: 3,
            nombre: 'Sector 3',
          },
        },
      };
      (apiClient.patch as jest.Mock).mockResolvedValue({ data: mockVehiculo });

      const result = await vehiculosService.update('1', updates);

      expect(result).toEqual(mockVehiculo);
      expect(apiClient.patch).toHaveBeenCalledWith(
        API_ENDPOINTS.VEHICULOS.UPDATE('1'),
        expect.objectContaining({
          infoAdicional: expect.objectContaining({
            id_sector_pertenencia: 3,
          }),
        })
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

  describe('getDropdownOptions', () => {
    it('should return dropdown options with correct structure', async () => {
      const result = await vehiculosService.getDropdownOptions();

      expect(result).toHaveProperty('tiposVehiculo');
      expect(result).toHaveProperty('estados');
      expect(result).toHaveProperty('sectoresPertenencia');

      expect(Array.isArray(result.tiposVehiculo)).toBe(true);
      expect(Array.isArray(result.estados)).toBe(true);
      expect(Array.isArray(result.sectoresPertenencia)).toBe(true);

      // Verify structure of options
      result.tiposVehiculo.forEach((option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('value');
      });

      result.estados.forEach((option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('value');
      });

      result.sectoresPertenencia.forEach((option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('value');
      });
    });

    it('should return at least one option in each dropdown', async () => {
      const result = await vehiculosService.getDropdownOptions();

      expect(result.tiposVehiculo.length).toBeGreaterThan(0);
      expect(result.estados.length).toBeGreaterThan(0);
      expect(result.sectoresPertenencia.length).toBeGreaterThan(0);
    });
  });
});
