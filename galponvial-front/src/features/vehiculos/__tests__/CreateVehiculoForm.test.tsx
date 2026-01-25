import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateVehiculoForm } from '../components/CreateVehiculoForm';
import { useVehiculosStore } from '../store';
import type { DropdownData } from '../types';

jest.mock('../store');

describe('CreateVehiculoForm', () => {
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

  const mockCreateVehiculo = jest.fn();
  const mockResetCreateState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useVehiculosStore as unknown as jest.Mock).mockReturnValue({
      createLoading: false,
      createError: null,
      createSuccess: false,
      createVehiculo: mockCreateVehiculo,
      resetCreateState: mockResetCreateState,
    });
  });

  it('should render form with all required fields', () => {
    render(<CreateVehiculoForm dropdownData={mockDropdownData} />);

    expect(screen.getByLabelText(/Código vehículo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Marca/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Modelo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Año/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Empresa de seguros/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Número de serie/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Póliza/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Licencia del conductor/i)).toBeInTheDocument();
  });

  it('should render dropdown selects with options', () => {
    render(<CreateVehiculoForm dropdownData={mockDropdownData} />);

    const estadoSelect = screen.getByLabelText(/Estado/i) as HTMLSelectElement;
    expect(estadoSelect.options.length).toBeGreaterThan(1);

    const tipoSelect = screen.getByLabelText(/Tipo de vehículo/i) as HTMLSelectElement;
    expect(tipoSelect.options.length).toBeGreaterThan(1);

    const sectorSelect = screen.getByLabelText(/Sector de pertenencia/i) as HTMLSelectElement;
    expect(sectorSelect.options.length).toBeGreaterThan(1);
  });

  it('should render Guardar and Cancelar buttons', () => {
    render(<CreateVehiculoForm dropdownData={mockDropdownData} />);

    expect(screen.getByRole('button', { name: /Guardar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
  });

  it('should update form fields on input change', () => {
    render(<CreateVehiculoForm dropdownData={mockDropdownData} />);

    const codigoInput = screen.getByPlaceholderText('Ej: JWLF89-X') as HTMLInputElement;
    fireEvent.change(codigoInput, { target: { value: 'TEST-123' } });

    expect(codigoInput.value).toBe('TEST-123');
  });

  it('should call resetCreateState when clicking Cancelar', async () => {
    render(<CreateVehiculoForm dropdownData={mockDropdownData} />);

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockResetCreateState).toHaveBeenCalled();
    });
  });

  it('should show error message when createError is set', async () => {
    (useVehiculosStore as unknown as jest.Mock).mockReturnValue({
      createLoading: false,
      createError: 'Error al crear el vehículo',
      createSuccess: false,
      createVehiculo: mockCreateVehiculo,
      resetCreateState: mockResetCreateState,
    });

    render(<CreateVehiculoForm dropdownData={mockDropdownData} />);

    expect(screen.getByText('Error al crear el vehículo')).toBeInTheDocument();
  });

  it('should show success message when createSuccess is true', async () => {
    (useVehiculosStore as unknown as jest.Mock).mockReturnValue({
      createLoading: false,
      createError: null,
      createSuccess: true,
      createVehiculo: mockCreateVehiculo,
      resetCreateState: mockResetCreateState,
    });

    render(<CreateVehiculoForm dropdownData={mockDropdownData} />);

    await waitFor(() => {
      expect(screen.getByText(/Vehículo creado exitosamente/i)).toBeInTheDocument();
    });
  });
});
