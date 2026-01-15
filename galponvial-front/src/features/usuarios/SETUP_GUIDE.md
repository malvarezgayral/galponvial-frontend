# Admin Panel Setup & Development Guide

## 📋 Quick Start

### 1. Project Structure
The admin panel is located in `src/features/usuarios/` and follows the feature-based architecture:

```
src/features/usuarios/
├── pages/
│   └── UsuariosPage.tsx                    # Main entry point
├── components/
│   ├── AdminDashboard.tsx                  # User management UI
│   ├── UserFormModal.tsx                   # Create/Edit user form
│   ├── UserActionMenu.tsx                  # User action dropdown
│   ├── RolesManagement.tsx                 # Role management UI
│   ├── PermissionsManagement.tsx           # Permission viewing UI
│   └── ProtectedAdminRoute.tsx             # Access control
├── services/
│   └── usuariosService.ts                  # API client
├── hooks/
│   ├── useAdminPermissions.ts              # Permission checking
│   └── useBulkUserActions.ts               # Bulk operations
├── store.ts                                 # Zustand state management
├── types.ts                                 # TypeScript types
├── __tests__/                               # Jest test files
├── ADMIN_PANEL_README.md                   # Full documentation
└── QUICK_REFERENCE.md                      # Quick reference guide
```

### 2. Key Dependencies

These are already configured in `package.json`:
- **Zustand** - State management (`import { create } from 'zustand'`)
- **Axios** - HTTP client (`import { apiClient } from '@/services/api'`)
- **React Router v7** - Navigation
- **TailwindCSS v4** - Styling

### 3. Enable Admin Panel in Navbar

The admin panel is accessible via the "Usuarios" button in the navbar, but you should protect it:

```tsx
// src/components/Navbar.tsx
import { useAdminPermissions } from '@/features/usuarios/hooks/useAdminPermissions';

const Navbar = () => {
  const { hasAdminAccess } = useAdminPermissions();
  
  const navLinks: NavItem[] = [
    { name: "Almacén", href: ROUTES.almacen },
    { name: "Vehículos", href: ROUTES.vehiculos },
    // Only show to admins
    ...(hasAdminAccess() 
      ? [{ name: "Usuarios", href: ROUTES.usuarios }]
      : []
    ),
  ];
  
  return /* ... */;
};
```

### 4. Backend API Endpoints Required

The admin panel expects these API endpoints to be available:

#### Users
```
GET    /api/usuarios?page=1&pageSize=10
GET    /api/usuarios/:id
POST   /api/usuarios
PUT    /api/usuarios/:id
DELETE /api/usuarios/:id
PATCH  /api/usuarios/:id/toggle-active
POST   /api/usuarios/:id/reset-password
```

#### Roles
```
GET    /api/roles
GET    /api/roles/:id
POST   /api/roles
PUT    /api/roles/:id
DELETE /api/roles/:id
```

#### Permissions
```
GET    /api/permisos
GET    /api/permisos?modulo=vehiculos
```

### 5. Mock Data for Development

Create mock data in `__mocks__` folder for development without backend:

```ts
// src/features/usuarios/services/__mocks__/usuariosService.ts
export const usuariosService = {
  getAll: async () => [
    {
      id: '1',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@test.com',
      rol: 'admin',
      permisos: [],
      activo: true,
      fechaCreacion: '2026-01-01',
      ultimaModificacion: '2026-01-01'
    }
  ],
  // ... other mocked methods
};
```

## 🔧 Development Workflow

### Adding a New User Feature

1. **Add to Types** (`types.ts`)
   ```typescript
   export interface User {
     // ... existing fields
     nuevoField: string; // Add new field
   }
   ```

2. **Update Service** (`services/usuariosService.ts`)
   - API calls remain the same, backend handles the field

3. **Update Form** (`components/UserFormModal.tsx`)
   ```tsx
   const [formData, setFormData] = useState({
     // ... existing fields
     nuevoField: '', // Add to form
   });
   ```

4. **Update Display** (`components/AdminDashboard.tsx`)
   ```tsx
   const columns = [
     // ... existing columns
     { key: 'nuevoField' as const, label: 'Nuevo Campo' },
   ];
   ```

### Adding New Permissions Check

1. **Add to Hook** (`hooks/useAdminPermissions.ts`)
   ```typescript
   canDoSomething: () => {
     return user?.rol === 'super-admin';
   }
   ```

2. **Use in Component**
   ```tsx
   const { canDoSomething } = useAdminPermissions();
   
   if (!canDoSomething()) return null;
   return <Button>Do Something</Button>;
   ```

### Adding Role Permissions

The role-permission assignment will be handled by the backend API. In the UI:

1. Fetch roles with their permissions in `RolesManagement.tsx`
2. Display permission checkboxes in role form
3. Send selected permissions in PUT/POST request

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Write Tests for New Feature

```typescript
// src/features/usuarios/__tests__/myFeature.test.ts
import { usuariosService } from '../services/usuariosService';

jest.mock('@/services/api');

describe('My Feature', () => {
  it('should do something', async () => {
    // Test implementation
  });
});
```

### Test Coverage
- Service layer: API calls and error handling
- Store actions: State updates and side effects
- Hooks: Permission logic and state usage
- Components: User interactions and rendering

## 🎨 Styling Customization

### Use Existing Color Variables

```tsx
// DO: Use CSS variables
<div className="bg-[var(--color-navbar-nav)] text-white">

// DON'T: Hardcode colors
<div className="bg-blue-600">
```

### Available Colors (from `src/index.css`)
- `--color-navbar-bg` (#242424) - Dark background
- `--color-navbar-nav` (#0062e3) - Primary blue
- `--color-navbar-text` (#ffffff) - White text
- `--color-text-primary` (#1f2937) - Dark grey text
- `--color-bg-light` (#f3f4f6) - Light background

### Add New Color Variable

1. Add to `src/index.css`
   ```css
   @layer theme {
     :root {
       --color-new: #YOUR_HEX;
     }
   }
   ```

2. Use in components
   ```tsx
   <div className="bg-[var(--color-new)]">
   ```

## 🐛 Common Issues & Solutions

### Issue: Admin Panel Not Accessible

**Solution**: Check role-based access
```tsx
// Verify user has admin role
const { user } = useAppStore();
console.log('User role:', user?.rol); // Should be 'admin' or 'super-admin'
```

### Issue: API Calls Failing

**Solution**: Verify API endpoints
```tsx
// Check API_ENDPOINTS in src/services/apiEndpoints.ts
const endpoint = API_ENDPOINTS.USUARIOS.LIST;
console.log('Endpoint:', endpoint); // Should be '/usuarios'
```

### Issue: Modal Not Closing

**Solution**: Check modal state in store
```tsx
// Ensure setModalAbierto(false) is called after action
setModalAbierto(false);
```

### Issue: Permissions Not Working

**Solution**: Check useAdminPermissions hook
```tsx
const { isAdmin } = useAdminPermissions();
console.log('Is admin:', isAdmin()); // Should be true for admins
```

## 📚 Documentation References

- [Full Admin Panel Documentation](./ADMIN_PANEL_README.md)
- [Quick Reference Guide](./QUICK_REFERENCE.md)
- [Copilot Instructions](../../.github/copilot-instructions.md)
- [Zustand Store Docs](https://docs.pmnd.rs/zustand/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [React Router Docs](https://reactrouter.com/)

## 🔐 Security Checklist

- [ ] Admin panel routes are protected
- [ ] API calls include auth token
- [ ] Delete operations require confirmation
- [ ] Password fields use secure type
- [ ] Error messages don't leak sensitive data
- [ ] Tokens are properly stored (localStorage/cookies)
- [ ] Expired tokens trigger re-authentication

## 🚀 Deployment Checklist

- [ ] API endpoints configured in `.env`
- [ ] Backend endpoints implemented
- [ ] Tests passing (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors/warnings
- [ ] Tested on multiple browsers

## 📞 Getting Help

1. Check [ADMIN_PANEL_README.md](./ADMIN_PANEL_README.md) for detailed documentation
2. Review [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for visual examples
3. Check component JSDoc comments
4. Look at test files for usage examples
5. Review similar components for patterns
