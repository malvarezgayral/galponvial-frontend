import { render, screen, fireEvent } from '@testing-library/react';
import { VehiculoCard } from '../components/VehiculoCard';
import { useAppStore } from '@/app/stores/appStore';
import type { Vehiculo } from '../types';

jest.mock('@/app/stores/appStore');

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

describe('VehiculoCard', () => {
  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onViewDetails: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render vehicle information', () => {
    (useAppStore as unknown as jest.Mock).mockReturnValue({ user: null });

    render(
      <VehiculoCard
        vehiculo={mockVehiculo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onViewDetails={mockHandlers.onViewDetails}
      />
    );

    expect(screen.getByText('VH001')).toBeInTheDocument();
    expect(screen.getByText('Camioneta 1')).toBeInTheDocument();
    expect(screen.getByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Hilux')).toBeInTheDocument();
  });

  it('should call onViewDetails when VER MÁS button is clicked', () => {
    (useAppStore as unknown as jest.Mock).mockReturnValue({ user: null });

    render(
      <VehiculoCard
        vehiculo={mockVehiculo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onViewDetails={mockHandlers.onViewDetails}
      />
    );

    const verMasButton = screen.getByText('VER MÁS');
    fireEvent.click(verMasButton);

    expect(mockHandlers.onViewDetails).toHaveBeenCalledWith(mockVehiculo);
  });

  it('should show edit button for admin user', () => {
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      user: { rol: 'admin', nombre: 'Admin', email: 'admin@test.com' },
    });

    const { container } = render(
      <VehiculoCard
        vehiculo={mockVehiculo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onViewDetails={mockHandlers.onViewDetails}
      />
    );

    const editButton = container.querySelector('button[title="Editar vehículo"]');
    expect(editButton).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      user: { rol: 'admin', nombre: 'Admin', email: 'admin@test.com' },
    });

    const { container } = render(
      <VehiculoCard
        vehiculo={mockVehiculo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onViewDetails={mockHandlers.onViewDetails}
      />
    );

    const editButton = container.querySelector('button[title="Editar vehículo"]');
    fireEvent.click(editButton!);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockVehiculo);
  });

  it('should show delete button for admin user', () => {
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      user: { rol: 'admin', nombre: 'Admin', email: 'admin@test.com' },
    });

    const { container } = render(
      <VehiculoCard
        vehiculo={mockVehiculo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onViewDetails={mockHandlers.onViewDetails}
      />
    );

    const deleteButton = container.querySelector('button[title="Eliminar vehículo"]');
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', () => {
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      user: { rol: 'admin', nombre: 'Admin', email: 'admin@test.com' },
    });

    const { container } = render(
      <VehiculoCard
        vehiculo={mockVehiculo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onViewDetails={mockHandlers.onViewDetails}
      />
    );

    const deleteButton = container.querySelector('button[title="Eliminar vehículo"]');
    fireEvent.click(deleteButton!);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockVehiculo);
  });

  it('should not show edit/delete buttons for regular user', () => {
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      user: { rol: 'usuario', nombre: 'Usuario', email: 'user@test.com' },
    });

    const { container } = render(
      <VehiculoCard
        vehiculo={mockVehiculo}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onViewDetails={mockHandlers.onViewDetails}
      />
    );

    const editButton = container.querySelector('button[title="Editar vehículo"]');
    const deleteButton = container.querySelector('button[title="Eliminar vehículo"]');

    expect(editButton).not.toBeInTheDocument();
    expect(deleteButton).not.toBeInTheDocument();
  });
});
