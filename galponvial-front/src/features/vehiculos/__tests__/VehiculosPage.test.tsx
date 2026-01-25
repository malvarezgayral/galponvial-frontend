import { render, screen } from '@testing-library/react';
import VehiculosPage from '../pages/VehiculosPage';

// Mock the store to avoid real API calls
jest.mock('@/app/stores/vehiculosStore', () => ({
  useVehiculosStore: () => ({
    vehiculos: [],
    isLoading: false,
    error: null,
    fetchVehiculos: jest.fn(),
  }),
}));

describe('VehiculosPage', () => {
  it('should render page without crashing', () => {
    render(<VehiculosPage />);
    const page = screen.getByText(/Vehiculos Page/i);
    expect(page).toBeInTheDocument();
  });
});
