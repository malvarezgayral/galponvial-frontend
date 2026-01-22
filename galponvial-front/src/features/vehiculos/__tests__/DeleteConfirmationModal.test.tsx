import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  const mockHandlers = {
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <DeleteConfirmationModal
        isOpen={false}
        vehiculoNombre="Camioneta 1"
        onConfirm={mockHandlers.onConfirm}
        onCancel={mockHandlers.onCancel}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        vehiculoNombre="Camioneta 1"
        onConfirm={mockHandlers.onConfirm}
        onCancel={mockHandlers.onCancel}
      />
    );

    expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument();
  });

  it('should display vehicle name in confirmation message', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        vehiculoNombre="Camioneta 1"
        onConfirm={mockHandlers.onConfirm}
        onCancel={mockHandlers.onCancel}
      />
    );

    expect(screen.getByText(/Camioneta 1/)).toBeInTheDocument();
  });

  it('should call onConfirm when Eliminar button is clicked', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        vehiculoNombre="Camioneta 1"
        onConfirm={mockHandlers.onConfirm}
        onCancel={mockHandlers.onCancel}
      />
    );

    const eliminarButton = screen.getByText('Eliminar');
    fireEvent.click(eliminarButton);

    expect(mockHandlers.onConfirm).toHaveBeenCalled();
  });

  it('should call onCancel when Cancelar button is clicked', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        vehiculoNombre="Camioneta 1"
        onConfirm={mockHandlers.onConfirm}
        onCancel={mockHandlers.onCancel}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockHandlers.onCancel).toHaveBeenCalled();
  });

  it('should show loading state when isLoading is true', () => {
    const { container } = render(
      <DeleteConfirmationModal
        isOpen={true}
        vehiculoNombre="Camioneta 1"
        onConfirm={mockHandlers.onConfirm}
        onCancel={mockHandlers.onCancel}
        isLoading={true}
      />
    );

    const buttons = container.querySelectorAll('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
