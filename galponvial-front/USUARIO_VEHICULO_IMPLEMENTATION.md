# Implementación: Relaciones Usuario-Vehículo

## Descripción General
Se ha implementado un nuevo servicio en la pantalla de Servicios para administrar las relaciones entre usuarios y vehículos. Esta funcionalidad permite visualizar todas las asignaciones de vehículos a usuarios con opciones para ver detalles y desasignar relaciones.

## Archivos Creados

### 1. **Servicio API** - `src/features/servicios/services/usuarioVehiculoService.ts`
Proporciona tres métodos principales:
- `getAll(page, pageSize)`: Obtiene todas las relaciones usuario-vehículo con paginación
- `getById(id)`: Obtiene los detalles de una relación específica
- `desasignarRelacion(id)`: Desasigna una relación estableciendo fecha_hasta al día actual

### 2. **Página Principal** - `src/features/servicios/pages/UsuarioVehiculoPage.tsx`
Página completa con:
- Tabla responsive mostrando todas las relaciones
- Columnas: Código vehículo, Nombre vehículo, Nombre usuario, DNI usuario, Fecha desde, Fecha hasta
- Botones de acción: "Ver Detalles" y "Desasignar"
- Paginación funcional
- Manejo de estados (cargando, error, vacío)
- Confirmación antes de desasignar

### 3. **Modal de Detalles** - `src/features/servicios/components/DetallesRelacionModal.tsx`
Modal que muestra:
- **Información del vehículo**: Código, nombre, marca, modelo, año, tipo, estado, consumo
- **Información del usuario**: DNI, nombre, apellido, email, estado, fecha de alta
- **Información de la asignación**: Fecha desde y fecha hasta
- **Roles asignados**: Lista de roles del usuario con fechas de asignación

### 4. **Tests Unitarios** - `src/features/servicios/services/__tests__/usuarioVehiculoService.test.ts`
Cobertura completa con:
- Test para obtener todas las relaciones con paginación
- Test para parámetros de paginación por defecto
- Test para obtener una relación específica
- Test para desasignar una relación

## Cambios a Archivos Existentes

### 1. **Tipos** - `src/features/servicios/types.ts`
Agregadas nuevas interfaces:
- `RolAsignado`: Información de rol asignado
- `UsuarioVehiculoRelacion`: Datos completos de la relación
- `UsuarioVehiculoResponse`: Respuesta paginada del servidor
- `DesasignarVehiculoRequest`: Request para desasignar relación

### 2. **Router** - `src/app/router.tsx`
- Importada la nueva página `UsuarioVehiculoPage`
- Agregada ruta `/servicios/usuario-vehiculo` protegida con `AdminProtectedRoute`

### 3. **Protección de Rutas** - `src/app/components/AdminProtectedRoute.tsx`
- Actualizado para incluir 'superuser' en los roles permitidos
- Ahora permite: 'admin', 'super-admin', 'superadmin', 'superuser'

### 4. **Página de Servicios** - `src/features/servicios/pages/ServiciosPage.tsx`
- Agregado nuevo icono (UserVehicleIcon)
- Agregada tarjeta de "Relaciones Usuario-Vehículo"
- Visibilidad condicional solo para usuarios admin/superuser/superadmin

## Rutas

- **Ruta de acceso**: `/servicios/usuario-vehiculo`
- **Tipo de protección**: `AdminProtectedRoute` - Solo accessible por superuser, admin, super-admin o superadmin
- **Referencia en navegación**: Tarjeta en página de servicios (solo visible para admins)

## Características

✅ **Visualización de tabla** con todas las relaciones usuario-vehículo
✅ **Paginación** con soporte para múltiples páginas
✅ **Modal de detalles** con información completa
✅ **Desasignación de relaciones** con confirmación
✅ **Protección de acceso** basada en roles
✅ **Manejo de errores** y estados de carga
✅ **Tests unitarios** completos (4 tests, 100% pass)
✅ **Cumple con estándares** de linting y TypeScript

## Endpoint Backend

**GET** `/vehiculos/usuario-vehiculo?page=1&pageSize=10`

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id_usuario_vehiculo": 7,
        "id_vehiculo": 5,
        "id_usuario": "37766524",
        "fecha_desde": "2026-02-09",
        "fecha_hasta": null,
        "usuario": { ... },
        "vehiculo": { ... }
      }
    ],
    "total": 7,
    "page": 1,
    "pageSize": 10
  },
  "message": "7 relaciones usuario-vehículo encontradas"
}
```

## Próximos Pasos

Se encuentra lista la base para implementar los siguientes servicios:
1. **Asignar relación** - POST a `/vehiculos/usuario-vehiculo` 
2. **Desasignar relación** - Ya implementado (PUT a `/vehiculos/usuario-vehiculo/:id`)
