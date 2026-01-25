import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditVehiculoModal } from '../components/EditVehiculoModal';
import { useVehiculosStore } from '../store';
import type { Vehiculo, DropdownData } from '../types';

jest.mock('../store');

const mockVehiculo: Vehiculo = {
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
};

const mockDropdownData: DropdownData = {
  tiposVehiculo: [
    { id: 1, label: 'Camioneta', value: 'camioneta' },
    { id: 2, label: 'Auto', value: 'auto' },
  ],
  estados: [
    { id: 1, label: 'Disponible', value: 'disponible' },
    { id: 2, label: 'Mantenimiento', value: 'mantenimiento' },
  ],
  sectoresPertenencia: [
    { id: 1, label: 'Sector Centro', value: 1 },
    { id: 2, label: 'Sector Puerto', value: 2 },
  ],
};

describe('EditVehiculoModal', () => {
  const mockHandlers = {
    onClose: jest.fn(),
  };

  const mockUpdateVehiculo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useVehiculosStore as unknown as jest.Mock).mockReturnValue({
      vehiculos: [mockVehiculo],
      updateVehiculo: mockUpdateVehiculo,
    });
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <EditVehiculoModal
        isOpen={false}
        vehiculoId="1"
        dropdownData={mockDropdownData}
        onClose={mockHandlers.onClose}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true and vehiculoId is provided', () => {
    render(
      <EditVehiculoModal
        isOpen={true}
        vehiculoId="1"
        dropdownData={mockDropdownData}
        onClose={mockHandlers.onClose}
      />
    );

    expect(screen.getByText('Editar Vehículo')).toBeInTheDocument();
  });

  it('should load vehicle data into form fields', () => {
    render(
      <EditVehiculoModal
        isOpen={true}
        vehiculoId="1"
        dropdownData={mockDropdownData}
        onClose={mockHandlers.onClose}
      />
    );

    const inputs = screen.getAllByDisplayValue(//) as HTMLInputElement[];
    expect(screen.getByDisplayValue('Camioneta 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Toyota')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hilux')).toBeInTheDocument();
  });

  it('should allow editing form fields', async () => {
    render(
      <EditVehiculoModal
        isOpen={true}
        vehiculoId="1"
        dropdownData={mockDropdownData}
        onClose={mockHandlers.onClose}
      />
    );

    const nameInput = screen.getByDisplayValue('Camioneta 1') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Camioneta Actualizada' } });

    await waitFor(() => {
      expect(nameInput.value).toBe('Camioneta Actualizada');
    });
  });

  it('should handle form submission', async () => {
    mockUpdateVehiculo.mockResolvedValue(undefined);

    render(
      <EditVehiculoModal
        isOpen={true}
        vehiculoId="1"
        dropdownData={mockDropdownData}
        onClose={mockHandlers.onClose}
      />
    );

    const submitButton = screen.getByText('Guardar Cambios');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateVehiculo).toHaveBeenCalledWith('1', expect.any(Object));
    });
  });

  it('should close modal on cancel', () => {
    render(
      <EditVehiculoModal
        isOpen={true}
        vehiculoId="1"
        dropdownData={mockDropdownData}
        onClose={mockHandlers.onClose}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockHandlers.onClose).toHaveBeenCalled();
  });

  it('should display error message on failure', async () => {
    mockUpdateVehiculo.mockRejectedValue(new Error('Network error'));

    render(
      <EditVehiculoModal
        isOpen={true}
        vehiculoId="1"
        dropdownData={mockDropdownData}
        onClose={mockHandlers.onClose}
      />
    );

    const submitButton = screen.getByText('Guardar Cambios');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
  });

  it('should display success message on success', async () => {
    mockUpdateVehiculo.mockResolvedValue(undefined);

    render(
      <EditVehiculoModal
        isOpen={true}
        vehiculoId="1"
        dropdownData={mockDropdownData}
        onClose={mockHandlers.onClose}
      />
    );

    const submitButton = screen.getByText('Guardar Cambios');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/actualizado correctamente/i)).toBeInTheDocument();
    });
  });
});
