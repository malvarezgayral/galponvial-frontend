# Admin Panel Documentation

## Overview

The Admin Panel is a comprehensive user, role, and permission management system built for GalponVial. It provides administrators and super-administrators with tools to manage users, assign roles, and control system permissions.

## Access & Permissions

### Who Can Access the Admin Panel?
- **Admin** - Can manage users, view roles and permissions (limited access)
- **Super-Admin** - Full access to all admin features including role and permission management

### Access Routes
- Admin Panel: `/usuarios` (accessed via navbar "Usuarios" button)
- Protected by `ProtectedAdminRoute` component with role-based access control

## Features

### 1. User Management (👥 Usuarios Tab)

#### Features:
- **View Users**: Paginated list of all system users (10 per page)
- **Create Users**: Add new users with name, email, password, and role assignment
- **Edit Users**: Update user information and role assignments
- **Activate/Deactivate**: Toggle user account status without deletion
- **Delete Users**: Permanently remove users from the system (Super-Admin only)
- **Reset Password**: Force password reset for user accounts (Admin+)
- **User Status**: Visual indicator for active/inactive accounts

#### User Table Columns:
- Nombre (Full Name)
- Email
- Rol (Role badge with color coding)
- Estado (Active/Inactive status)
- Acciones (Action menu)

#### Pagination:
- 10 users per page by default
- Next/Previous navigation
- Total user count display

### 2. Role Management (🎭 Roles Tab)

#### Features:
- **View Roles**: List all available system roles
- **Create Roles**: Define new roles with permissions
- **Edit Roles**: Modify role details and permissions
- **Delete Roles**: Remove obsolete roles (Super-Admin only)

#### Role Properties:
- `nombre` - Role name
- `descripcion` - Role description
- `permisos` - Associated permissions array
- `activo` - Active/Inactive status

#### Available Roles:
- `usuario` - Regular user with limited access
- `admin` - Administrator with extended permissions
- `super-admin` - Full system access

### 3. Permission Management (🔐 Permisos Tab)

#### Features:
- **View Permissions**: All system permissions organized by module
- **Permission Details**: See permission name, description, and action type
- **Module Grouping**: Permissions grouped by system module

#### Permission Structure:
```typescript
{
  id: string;
  nombre: string;           // e.g., "Ver vehículos"
  descripcion: string;
  modulo: 'vehiculos' | 'almacen' | 'usuarios' | 'auditoria' | 'admin';
  accion: 'crear' | 'leer' | 'actualizar' | 'eliminar';
}
```

#### Modules:
- `vehiculos` - Vehicle management
- `almacen` - Warehouse management
- `usuarios` - User management
- `auditoria` - Audit logging
- `admin` - Admin panel access

## Component Structure

### Components

#### AdminDashboard.tsx
Main container for user management with table, pagination, and modal handling.
```tsx
<AdminDashboard />
```

#### UserFormModal.tsx
Form component for creating and editing users with validation.
```tsx
// Automatically opens based on store state
```

#### UserActionMenu.tsx
Dropdown menu with user-specific actions (Edit, Activate/Deactivate, Delete).
```tsx
<UserActionMenu usuario={user} />
```

#### RolesManagement.tsx
Complete role management interface with CRUD operations.
```tsx
<RolesManagement />
```

#### PermissionsManagement.tsx
View and manage system permissions, organized by module.
```tsx
<PermissionsManagement />
```

#### ProtectedAdminRoute.tsx
Route guard component ensuring only authorized users access admin features.
```tsx
<ProtectedAdminRoute requiredRole="super-admin">
  {children}
</ProtectedAdminRoute>
```

## State Management (Zustand Store)

### useUsuariosStore
Centralized state management for all admin panel operations.

#### User State:
```typescript
usuarios: User[]                    // List of users
usuarioSeleccionado: User | null    // Currently selected user
usuariosTotal: number               // Total users count
usuariosPagina: number              // Current page
usuariosPageSize: number            // Items per page (10)
```

#### Roles State:
```typescript
roles: Role[]                       // List of roles
rolesSeleccionados: Role[]          // Selected roles
```

#### Permissions State:
```typescript
permisos: Permission[]              // All system permissions
```

#### UI State:
```typescript
isLoading: boolean                  // Loading indicator
error: string | null                // Error messages
modalAbierto: boolean               // Modal visibility
modoEdicion: boolean                // Edit vs Create mode
```

#### Actions:
```typescript
// User Actions
fetchUsuarios(page?, pageSize?)     // Load paginated users
fetchUsuarioById(id)                // Get single user
crearUsuario(data)                  // Create new user
actualizarUsuario(id, data)         // Update user
eliminarUsuario(id)                 // Delete user
toggleUsuarioActivo(id)             // Toggle active status
resetearPassword(id, password)      // Reset user password
setUsuarioSeleccionado(user)        // Set selected user
setModoEdicion(boolean)             // Toggle edit mode
setModalAbierto(boolean)            // Toggle modal
setUsuariosPagina(number)           // Change page

// Role Actions
fetchRoles()                        // Load all roles
crearRol(data)                      // Create role
actualizarRol(id, data)             // Update role
eliminarRol(id)                     // Delete role

// Permission Actions
fetchPermisos()                     // Load all permissions
getPermisosPorModulo(modulo)        // Get permissions by module
```

## Custom Hooks

### useAdminPermissions()
Check user admin permissions and capabilities.

```typescript
const {
  isAdmin,              // Is user admin or super-admin?
  isSuperAdmin,         // Is user super-admin?
  canCreateAdmin,       // Can create admin users?
  canManageRoles,       // Can manage roles?
  canResetPassword,     // Can reset passwords?
  canDeleteUsers,       // Can delete users?
  hasPermission,        // Check specific permission
  hasAdminAccess        // Has admin panel access?
} = useAdminPermissions();
```

### useBulkUserActions()
Perform bulk operations on multiple users.

```typescript
const {
  toggleMultipleActive,  // Toggle multiple users active status
  deleteMultiple,        // Delete multiple users
  exportToCSV            // Export users to CSV file
} = useBulkUserActions();
```

## Services (usuariosService)

### User Methods
- `getAll(page, pageSize)` - Fetch paginated users
- `getById(id)` - Fetch single user
- `create(userData)` - Create new user
- `update(id, userData)` - Update user
- `delete(id)` - Delete user
- `toggleActive(id)` - Toggle user status
- `resetPassword(id, password)` - Reset password

### Role Methods
- `getAllRoles()` - Fetch all roles
- `getRoleById(id)` - Fetch single role
- `createRole(roleData)` - Create role
- `updateRole(id, roleData)` - Update role
- `deleteRole(id)` - Delete role

### Permission Methods
- `getAllPermissions()` - Fetch all permissions
- `getPermissionsByModule(module)` - Fetch permissions by module

## Types

### User
```typescript
interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'usuario' | 'admin' | 'super-admin';
  permisos: Permission[];
  activo: boolean;
  fechaCreacion: string;
  ultimaModificacion: string;
}
```

### Role
```typescript
interface Role {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: Permission[];
  activo: boolean;
}
```

### Permission
```typescript
interface Permission {
  id: string;
  nombre: string;
  descripcion: string;
  modulo: 'vehiculos' | 'almacen' | 'usuarios' | 'auditoria' | 'admin';
  accion: 'crear' | 'leer' | 'actualizar' | 'eliminar';
}
```

## Styling

### Color Scheme
All components follow the brand color scheme from `src/index.css`:
- **Primary Color**: `--color-navbar-nav` (#0062e3) - Blue for role badges
- **Background**: `--color-bg-light` (#f3f4f6) - Light grey
- **Text Primary**: `--color-text-primary` (#1f2937) - Dark grey

### Component Styling
- **Tables**: Bordered with hover effects
- **Buttons**: Variant support (primary/secondary/danger)
- **Modals**: Center-positioned with backdrop
- **Status Badges**: Green for active, Red for inactive
- **Role Badges**: Blue background with white text

## Workflow Examples

### Create New User
1. Click "+ Crear Usuario" button
2. Fill in form (Nombre, Apellido, Email, Contraseña, Rol)
3. Click "Crear Usuario"
4. User appears in table

### Edit User
1. Click dropdown menu (⋮) on user row
2. Click "✏️ Editar"
3. Modify fields (password optional)
4. Click "Guardar Cambios"

### Manage Roles
1. Navigate to "🎭 Roles" tab
2. View existing roles or create new
3. Click "Editar" or "Eliminar" for actions
4. Changes apply immediately

### View Permissions
1. Navigate to "🔐 Permisos" tab
2. Permissions auto-grouped by module
3. View permission details (name, description, action)

## Error Handling

All operations include error handling with user-friendly messages:
- API errors display in alert banner
- Failed operations don't update UI
- Retry available through state management
- Validation messages for form fields

## Testing

### Test Files
- `usuariosService.test.ts` - Service layer tests
- `useAdminPermissions.test.ts` - Permission hook tests

### Test Coverage
- User CRUD operations
- Role management
- Permission retrieval
- Permission checking

## Security Considerations

1. **Role-Based Access Control**
   - Super-Admin only: Create/delete admins, manage roles
   - Admin: Manage users, reset passwords, view roles
   - User: Limited to own profile

2. **API Interceptors**
   - Access token auto-included in Authorization header
   - 401 responses trigger logout and redirect to login

3. **Password Handling**
   - Passwords never stored in frontend state
   - Password reset only available to authorized admins
   - New passwords transmitted via secure API

4. **Data Protection**
   - Sensitive operations require confirmation
   - Delete operations show warnings
   - Audit trail available in Auditoría module

## Backend API Endpoints

### Users
- `GET /api/usuarios?page=1&pageSize=10` - List users
- `GET /api/usuarios/:id` - Get user
- `POST /api/usuarios` - Create user
- `PUT /api/usuarios/:id` - Update user
- `DELETE /api/usuarios/:id` - Delete user
- `PATCH /api/usuarios/:id/toggle-active` - Toggle active
- `POST /api/usuarios/:id/reset-password` - Reset password

### Roles
- `GET /api/roles` - List roles
- `GET /api/roles/:id` - Get role
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### Permissions
- `GET /api/permisos` - List all permissions
- `GET /api/permisos?modulo=vehiculos` - By module

## Future Enhancements

1. **Bulk Operations**: Select multiple users for batch actions
2. **Advanced Filtering**: Filter by role, status, date range
3. **Export**: Download user lists as CSV/Excel
4. **Audit Trail**: View user action logs
5. **Activity Log**: See admin actions for compliance
6. **Email Notifications**: Notify users of role changes
7. **2FA Management**: Configure two-factor authentication
8. **Session Management**: View and terminate user sessions
