# Admin Panel - Quick Reference Guide

## 📊 Architecture Overview

```
src/features/usuarios/
├── pages/
│   └── UsuariosPage.tsx              # Main page with tab navigation
├── components/
│   ├── AdminDashboard.tsx            # User list & table
│   ├── UserFormModal.tsx             # Create/Edit form
│   ├── UserActionMenu.tsx            # User actions dropdown
│   ├── RolesManagement.tsx           # Role CRUD interface
│   ├── PermissionsManagement.tsx     # View permissions
│   └── ProtectedAdminRoute.tsx       # Access control wrapper
├── services/
│   └── usuariosService.ts            # API calls
├── hooks/
│   ├── useAdminPermissions.ts        # Permission checking
│   └── useBulkUserActions.ts         # Bulk operations
├── store.ts                           # Zustand state management
├── types.ts                           # TypeScript interfaces
└── __tests__/                         # Jest tests
```

## 🎨 Color Scheme

All components use the established brand colors from `src/index.css`:

| Element | Color Hex | CSS Variable | Usage |
|---------|-----------|-------------|-------|
| Primary Blue | #0062e3 | `--color-navbar-nav` | Buttons, Role badges, Links |
| Dark Background | #242424 | `--color-navbar-bg` | Navbar (not admin panel) |
| Light Background | #f3f4f6 | `--color-bg-light` | Page background |
| Text Primary | #1f2937 | `--color-text-primary` | Main text, Headers |
| Status Green | #80DD4B | - | Active status |
| Status Red | #dc2626 | - | Inactive/Delete status |

## 📑 Page Structure

### Main Admin Panel (UsuariosPage)
```
┌─ Panel de Administración ─────────────────────────┐
│                                                    │
│  👥 Usuarios | 🎭 Roles | 🔐 Permisos            │
│  ────────────────────────────────────────────────│
│                                                    │
│  ┌─ Gestión de Usuarios ──────────────────────┐ │
│  │ Nombre | Email | Rol | Estado | Acciones  │ │
│  │──────────────────────────────────────────  │ │
│  │ Juan P. | juan@... | Admin | Activo | ⋮  │ │
│  │ María L. | maria@.. | Usuario | Activo | ⋮ │
│  │──────────────────────────────────────────  │ │
│  │ Página 1 de 5  [Anterior] [Siguiente]    │ │
│  └─────────────────────────────────────────────┘ │
│                                                    │
└────────────────────────────────────────────────────┘
```

## 🔐 Permission Hierarchy

### Role Permissions Matrix

| Action | Usuario | Admin | Super-Admin |
|--------|---------|-------|------------|
| View Users | ❌ | ✅ | ✅ |
| Create User | ❌ | ✅ | ✅ |
| Edit User | ❌ | ✅ | ✅ |
| Delete User | ❌ | ❌ | ✅ |
| Create Admin | ❌ | ❌ | ✅ |
| Manage Roles | ❌ | ❌ | ✅ |
| Manage Permissions | ❌ | ❌ | ✅ |
| Reset Password | ❌ | ✅ | ✅ |

## 📝 Form Fields

### Create/Edit User Form
```
┌─ Crear Nuevo Usuario ───────────────────┐
│                                          │
│ Nombre:        [________________]      │
│ Apellido:      [________________]      │
│ Email:         [________________]      │
│ Contraseña:    [________________] 👁️ │
│ Rol:           [dropdown ▼]             │
│                - usuario                │
│                - admin                  │
│                - super-admin            │
│                                          │
│ [Cancelar]    [Crear Usuario]          │
└──────────────────────────────────────────┘
```

### Create/Edit Role Form
```
┌─ Crear Nuevo Rol ───────────────┐
│                                  │
│ Nombre:        [_________]     │
│ Descripción:   [___________]   │
│                [___________]   │
│                [___________]   │
│                                  │
│ [Cancelar]    [Crear]          │
└──────────────────────────────────┘
```

## 🔄 State Flow

```
UsuariosPage (Main Container)
    ├── adminDashboard
    │   ├── useUsuariosStore (hook)
    │   ├── Table (Shared UI)
    │   ├── UserFormModal
    │   │   └── usuariosService
    │   └── UserActionMenu
    │       └── useUsuariosStore actions
    ├── RolesManagement
    │   ├── useUsuariosStore (roles)
    │   └── Table
    └── PermissionsManagement
        ├── useUsuariosStore (permissions)
        └── Table
```

## 🧪 API Response Examples

### Get Users (Paginated)
```typescript
{
  data: [
    {
      id: "usr_001",
      nombre: "Juan",
      apellido: "Pérez",
      email: "juan@ejemplo.com",
      rol: "admin",
      permisos: [...],
      activo: true,
      fechaCreacion: "2026-01-01T10:00:00Z",
      ultimaModificacion: "2026-01-15T14:30:00Z"
    }
  ],
  total: 45,
  page: 1,
  pageSize: 10,
  totalPages: 5
}
```

### Get Roles
```typescript
[
  {
    id: "rol_001",
    nombre: "Admin",
    descripcion: "Administrador del sistema",
    permisos: [
      { id: "p_001", nombre: "Ver usuarios", ... }
    ],
    activo: true
  }
]
```

### Get Permissions
```typescript
[
  {
    id: "perm_001",
    nombre: "Ver vehículos",
    descripcion: "Permiso para ver lista de vehículos",
    modulo: "vehiculos",
    accion: "leer"
  }
]
```

## 🎯 Key Features Checklist

### User Management
- [x] View paginated user list
- [x] Create new users
- [x] Edit user information
- [x] Delete users
- [x] Toggle user active/inactive status
- [x] Reset user passwords
- [x] Assign roles to users

### Role Management
- [x] View all roles
- [x] Create new roles
- [x] Edit roles
- [x] Delete roles
- [x] Assign permissions to roles

### Permission Management
- [x] View all permissions
- [x] View permissions by module
- [x] Organize permissions by module
- [x] Display permission details

### Security & Access Control
- [x] Route protection (ProtectedAdminRoute)
- [x] Role-based access control (RBAC)
- [x] Permission checking (useAdminPermissions)
- [x] Error handling and validation
- [x] API token inclusion in requests

### User Experience
- [x] Tab navigation
- [x] Pagination controls
- [x] Modal forms
- [x] Action menus
- [x] Status indicators
- [x] Error alerts
- [x] Loading states
- [x] Confirmation dialogs

## 🚀 Usage Examples

### Access Admin Panel
```tsx
import UsuariosPage from '@/features/usuarios/pages/UsuariosPage';
import ProtectedAdminRoute from '@/features/usuarios/components/ProtectedAdminRoute';

// In router
<ProtectedAdminRoute>
  <UsuariosPage />
</ProtectedAdminRoute>
```

### Check Admin Permissions
```tsx
import { useAdminPermissions } from '@/features/usuarios/hooks/useAdminPermissions';

const MyComponent = () => {
  const { isAdmin, canDeleteUsers } = useAdminPermissions();
  
  if (!isAdmin()) return <p>Access Denied</p>;
  if (canDeleteUsers()) return <DeleteButton />;
};
```

### Use Admin Store
```tsx
import { useUsuariosStore } from '@/features/usuarios/store';

const Component = () => {
  const { usuarios, fetchUsuarios, crearUsuario } = useUsuariosStore();
  
  useEffect(() => {
    fetchUsuarios();
  }, []);
};
```

## 📱 Responsive Design

All components use Tailwind CSS for responsive design:
- Mobile: Stacked layout
- Tablet: 2-column where applicable
- Desktop: Full multi-column tables

## 🔗 Integration Points

### Backend API
- Base URL: `VITE_API_BASE_URL` (default: http://localhost:3000/api)
- Auth: Bearer token in Authorization header
- Interceptors: Auto-retry on 401, redirect on token expiration

### Navbar Integration
- "Usuarios" button navigates to `/usuarios`
- Only visible to admin+ roles (implement in Navbar)

### Global Store
- Uses `useAppStore` for current user info
- Updates user role on login
- Clears on logout

## 🧩 Customization

### Add New Role Permission
1. Update `Permission` type in `types.ts`
2. Add to backend permission seed
3. Refresh permissions in UI

### Change Pagination Size
```tsx
// In AdminDashboard.tsx
const usuariosPageSize = 20; // Change from 10 to 20
```

### Modify Colors
```css
/* In src/index.css */
--color-navbar-nav: #YOUR_COLOR; /* Changes all role badges */
```

### Add New Module Permissions
1. Update `modulo` enum in `Permission` type
2. Create corresponding service endpoints
3. Add permissions in backend

## 📚 Related Documentation

- [Full Admin Panel README](./ADMIN_PANEL_README.md)
- [Copilot Instructions](../.github/copilot-instructions.md)
- [Zustand Store Pattern](../../app/stores/)
- [Component Patterns](../../shared/ui/)
- [API Services](../../services/)
