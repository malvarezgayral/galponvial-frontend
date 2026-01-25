import { renderHook } from '@testing-library/react';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { useAppStore } from '@/app/stores/appStore';

jest.mock('@/app/stores/appStore');

describe('useAdminPermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return false for non-admin user', () => {
    (useAppStore as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        rol: 'usuario',
        permisos: [],
      },
    });

    const { result } = renderHook(() => useAdminPermissions());

    expect(result.current.isAdmin()).toBe(false);
    expect(result.current.isSuperAdmin()).toBe(false);
    expect(result.current.hasAdminAccess()).toBe(false);
  });

  it('should return true for admin user', () => {
    (useAppStore as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        rol: 'admin',
        permisos: [],
      },
    });

    const { result } = renderHook(() => useAdminPermissions());

    expect(result.current.isAdmin()).toBe(true);
    expect(result.current.hasAdminAccess()).toBe(true);
    expect(result.current.isSuperAdmin()).toBe(false);
  });

  it('should return true for super-admin user', () => {
    (useAppStore as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        rol: 'super-admin',
        permisos: [],
      },
    });

    const { result } = renderHook(() => useAdminPermissions());

    expect(result.current.isAdmin()).toBe(true);
    expect(result.current.isSuperAdmin()).toBe(true);
    expect(result.current.hasAdminAccess()).toBe(true);
    expect(result.current.canCreateAdmin()).toBe(true);
    expect(result.current.canManageRoles()).toBe(true);
  });

  it('should check specific permissions', () => {
    (useAppStore as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        rol: 'admin',
        permisos: [
          { nombre: 'view_users', id: '1' },
          { nombre: 'edit_users', id: '2' },
        ],
      },
    });

    const { result } = renderHook(() => useAdminPermissions());

    expect(result.current.hasPermission('view_users')).toBe(true);
    expect(result.current.hasPermission('delete_users')).toBe(false);
  });

  it('should return false when user is not authenticated', () => {
    (useAppStore as jest.Mock).mockReturnValue({
      user: null,
    });

    const { result } = renderHook(() => useAdminPermissions());

    expect(result.current.isAdmin()).toBe(false);
    expect(result.current.hasAdminAccess()).toBe(false);
  });
});
