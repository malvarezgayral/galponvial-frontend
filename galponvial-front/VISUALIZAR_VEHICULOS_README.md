# Sección de Visualizar Vehículos - Documentación

## Descripción General

La sección de "Visualizar vehículos" proporciona una interfaz completa para listar, filtrar y gestionar vehículos municipales con un sistema de permisos basado en roles.

## Características Implementadas

### 1. Grid de Cards de Vehículos
- **Layout**: Grid responsivo (1 columna en móvil, 2 en tablet, 3 en desktop)
- **Contenido de cada card**:
  - Código de vehículo
  - Nombre
  - Marca
  - Modelo
  - Botón "VER MÁS" para ver detalles
  - Badge de estado (disponible, mantenimiento, en_uso, retirado)

### 2. Botones Flotantes de Acciones
- **Editar** (lápiz): Solo visible para usuarios admin o superior
- **Eliminar** (basura): Solo visible para usuarios admin o superior

### 3. Sistema de Filtros (Cliente)
Todos los filtros se aplican del lado del cliente para mejor experiencia:

- **Búsqueda por nombre o código**
  - Input de texto con placeholder
  - Busca en campos `codigo` y `nombre`
  - Filtrado en tiempo real sin hacer requests

- **Filtro por estado**
  - Dropdown con opciones: Disponible, Mantenimiento, En uso, Retirado
  - Usa el mismo mock de estados que el formulario de creación

- **Filtro por tipo de vehículo**
  - Dropdown con opciones: Camioneta, Auto, Camión, Moto, Utilitario
  - Reutiliza los datos del formulario

- **Filtro por sector de pertenencia**
  - Dropdown con opciones: Sector Centro, Sector Puerto, Sector Rural, Sector Costa
  - Reutiliza los datos del formulario

- **Botón "Limpiar filtros"**
  - Resetea todos los filtros a su estado inicial

### 4. Modal de Confirmación para Eliminar
- Muestra el nombre del vehículo a eliminar
- Requiere confirmación explícita
- Muestra estado de carga durante la eliminación
- Previene acciones accidentales

## Arquitectura Técnica

### Store (Zustand)

**Archivo**: `src/features/vehiculos/store.ts`

**Estado**:
```typescript
interface VehiculosState {
  // Listado
  vehiculos: Vehiculo[];
  filteredVehiculos: Vehiculo[];
  listLoading: boolean;
  listError: string | null;

  // Filtros
  filters: {
    estado: string | null;
    tipo: string | null;
    sector: string | null;
    searchTerm: string;
  };

  // Métodos
  fetchAllVehiculos: () => Promise<void>;
  setFilter: (key, value) => void;
  resetFilters: () => void;
  updateVehiculo: (id, data) => Promise<void>;
  deleteVehiculo: (id) => Promise<void>;
}
```

**Función Helper**: `applyFilters()`
- Filtra el array completo en el cliente
- Evita hacer requests para cada cambio de filtro

### Componentes

#### `VehiculosView.tsx`
- Componente principal de la sección
- Maneja el ciclo de vida (fetch inicial)
- Controla modales de confirmación
- Gestiona handlers de acciones

#### `VehiculoCard.tsx`
- Card individual de vehículo
- Muestra información básica
- Botones flotantes con validación de permisos
- Usa `useAppStore` para verificar rol del usuario

#### `DeleteConfirmationModal.tsx`
- Modal de confirmación para eliminar
- Estados de carga
- Prevención de acciones accidentales

### Service

**Archivo**: `src/features/vehiculos/services/vehiculosService.ts`

**Métodos principales**:
- `getAll()`: GET /vehiculos - Obtiene todos los vehículos
- `update(id, data)`: PATCH /vehiculos/{id} - Actualiza un vehículo
- `delete(id)`: DELETE /vehiculos/{id} - Elimina un vehículo

**Formato de respuesta esperado**:
```json
{
  "success": true,
  "data": [ { Vehiculo[] } ],
  "message": "X total de vehículos"
}
```

## Sistema de Permisos

### Visualizar
- ✅ Cualquier usuario logueado

### Editar
- ✅ Admin (rol: 'admin')
- ✅ Super Admin (rol: 'super-admin')

### Eliminar
- ✅ Admin (rol: 'admin')
- ✅ Super Admin (rol: 'super-admin')

**Validación**: Se verifica en:
1. `VehiculoCard`: Mostrar/ocultar botones
2. `VehiculosView`: Al hacer click, se valida antes de abrir modal
3. Backend: Debe validar permisos también

## Flujo de Datos

```
VehiculosPage (activa VehiculosView)
    ↓
VehiculosView (on mount)
    ↓
fetchAllVehiculos()
    ↓
vehiculosService.getAll()
    ↓
Guardado en store.vehiculos
    ↓
applyFilters() con filtros iniciales
    ↓
Guardado en store.filteredVehiculos
    ↓
Grid de VehiculoCard renderiza filteredVehiculos
```

### Flujo de Filtrado

```
setFilter(key, value)
    ↓
Actualiza store.filters
    ↓
applyFilters(store.vehiculos, store.filters)
    ↓
Retorna array filtrado
    ↓
Actualiza store.filteredVehiculos
    ↓
Componente se re-renderiza automáticamente
```

### Flujo de Eliminación

```
handleDeleteClick(vehiculo)
    ↓
Validar permisos (canDelete)
    ↓
Abrir DeleteConfirmationModal
    ↓
Usuario confirma
    ↓
deleteVehiculo(id)
    ↓
vehiculosService.delete(id)
    ↓
Eliminar del array en store
    ↓
Aplicar filtros nuevamente
    ↓
Cerrar modal
```

## Estados de Carga y Error

### Carga Inicial
- Spinner centrado en la página
- Mensaje "Cargando..."

### Listado Vacío
- Mensaje "No hay vehículos disponibles"

### Con Filtros (sin resultados)
- Mensaje "No hay vehículos que coincidan con los filtros"

### Errores
- Banner rojo con mensaje de error
- Opción de reintentar

## Endpoint API Esperado

### GET /vehiculos
```
Respuesta:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "codigo": "VH001",
      "nombre": "Camioneta 1",
      "marca": "Toyota",
      "modelo": "Hilux",
      "anio": 2020,
      "tipo_vehiculo": "camioneta",
      "status": "disponible",
      "infoAdicional": {
        "numero_serie": 123456,
        "licencia_conductor": "ABC123",
        "color": "blanco",
        "seguro_empresa": "Seguros SA",
        "poliza": "POL001",
        "id_sector_pertenencia": 1
      },
      "fechaCreacion": "2024-01-01T00:00:00Z",
      "ultimaModificacion": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "15 total de vehículos"
}
```

### PATCH /vehiculos/{id}
```
Body (parcial):
{
  "codigo": "VH001",
  "nombre": "Camioneta 1",
  "marca": "Toyota",
  "modelo": "Hilux",
  "anio": 2020,
  "tipo_vehiculo": "camioneta",
  "status": "disponible",
  "uso_combustible": 0,
  "uso_km": 0,
  "infoAdicional": {
    "numero_serie": 123456,
    "licencia_conductor": "ABC123",
    "color": "blanco",
    "seguro_empresa": "Seguros SA",
    "poliza": "POL001",
    "id_sector_pertenencia": 1
  }
}

Respuesta: { vehiculo actualizado }
```

### DELETE /vehiculos/{id}
```
Respuesta:
{
  "success": true,
  "message": "Vehículo eliminado correctamente"
}
```

## Testing

Archivos de test creados:

1. `VehiculoCard.test.tsx`: 
   - Renderizado de información
   - Validación de permisos
   - Handlers de eventos

2. `DeleteConfirmationModal.test.tsx`:
   - Visible/oculto según isOpen
   - Confirmación y cancelación
   - Estado de carga

3. `store.test.ts`:
   - Fetch de vehículos
   - Aplicación de filtros
   - Eliminar/actualizar vehículos

## Próximas Características (TODO)

1. Modal/Formulario de edición de vehículos
2. Página de detalles de vehículo
3. Exportar a CSV/PDF
4. Paginación si hay muchos vehículos
5. Ordenamiento por columnas
6. Filtros avanzados
7. Búsqueda global mejorada

## Notas Importantes

- **Filtros en cliente**: Todos los filtros se aplican en el navegador, no en el servidor, para mejor UX
- **Sin paginación inicial**: Si hay muchos vehículos, se puede agregar después
- **Permisos**: Se validan en el cliente para mostrar/ocultar UI, pero el backend debe validar también
- **Estado de vehículo**: Usa colores para mejorar la visualización (verde=disponible, amarillo=mantenimiento, azul=en_uso, rojo=retirado)
