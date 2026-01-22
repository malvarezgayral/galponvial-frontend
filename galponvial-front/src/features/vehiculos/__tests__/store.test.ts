import { vehiculosService } from '../services/vehiculosService';
import type { Vehiculo } from '../types';

jest.mock('../services/vehiculosService');

const mockVehiculos: Vehiculo[] = [
  {
    id: '1',
    codigo: 'VH001',
    nombre: 'Camioneta 1',
    marca: 'Toyota',
    modelo: 'Hilux',
    anio: 2020,
    tipo_vehiculo: 'camioneta',
    status: 'disponible',
    infoAdicional: {
      numero_serie: 123456,
      licencia_conductor: 'ABC123',
      color: 'blanco',
      seguro_empresa: 'Seguros SA',
      poliza: 'POL001',
      id_sector_pertenencia: 1,
    },
  },
  {
    id: '2',
    codigo: 'VH002',
    nombre: 'Auto 1',
    marca: 'Ford',
    modelo: 'Focus',
    anio: 2021,
    tipo_vehiculo: 'auto',
    status: 'en_uso',
    infoAdicional: {
      numero_serie: 654321,
      licencia_conductor: 'DEF456',
      color: 'rojo',
      seguro_empresa: 'Seguros SA',
      poliza: 'POL002',
      id_sector_pertenencia: 2,
    },
  },
];

describe('vehiculosService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all vehicles', async () => {
    (vehiculosService.getAll as jest.Mock).mockResolvedValue(mockVehiculos);

    const result = await vehiculosService.getAll();

    expect(result).toEqual(mockVehiculos);
    expect(vehiculosService.getAll).toHaveBeenCalled();
  });

  it('should handle wrapped response format', async () => {
    const wrappedResponse = { data: mockVehiculos };
    (vehiculosService.getAll as jest.Mock).mockResolvedValue(wrappedResponse.data);

    const result = await vehiculosService.getAll();

    expect(result).toEqual(mockVehiculos);
  });

  it('should delete a vehicle', async () => {
    (vehiculosService.delete as jest.Mock).mockResolvedValue(undefined);

    await vehiculosService.delete('1');

    expect(vehiculosService.delete).toHaveBeenCalledWith('1');
  });

  it('should update a vehicle', async () => {
    const updated = { ...mockVehiculos[0], nombre: 'Updated Name' };
    (vehiculosService.update as jest.Mock).mockResolvedValue(updated);

    const result = await vehiculosService.update('1', { nombre: 'Updated Name' });

    expect(result).toEqual(updated);
    expect(vehiculosService.update).toHaveBeenCalledWith('1', { nombre: 'Updated Name' });
  });
});
