# Funcionalidad de Edición de Vehículos - Guía de Implementación

## 📋 Descripción General

Se ha implementado completamente la funcionalidad de edición de vehículos con un modal intuitivo que permite actualizar todos los campos del vehículo, incluyendo información adicional.

---

## 🎯 Flujo de Funcionamiento

### 1. Abrir Modal
```
Click en botón editar (lápiz)
    ↓
handleEdit() se ejecuta
    ↓
setSelectedVehiculoIdForEdit(vehiculo.id_vehiculo)
    ↓
setEditModalOpen(true)
    ↓
EditVehiculoModal se renderiza
```

### 2. Cargar Datos
```
Modal se abre
    ↓
useEffect detects isOpen y vehiculoId
    ↓
Buscar vehículo en store por ID
    ↓
Cargar datos en formData
    ↓
Mostrar campos pre-poblados
```

### 3. Editar Campos
```
Usuario escribe en campo
    ↓
onChange dispara handleInputChange()
    ↓
Actualizar formData (local state)
    ↓
Input muestra nuevo valor
```

### 4. Guardar Cambios
```
Click en "Guardar Cambios"
    ↓
handleSubmit() se ejecuta
    ↓
updateVehiculo(id, formData)
    ↓
PATCH /vehiculos/{id}
    ↓
Success: Mostrar mensaje + cerrar modal
Error: Mostrar error + mantener modal abierto
```

---

## 📁 Archivos Creados/Modificados

### NUEVO: EditVehiculoModal.tsx
**Ubicación**: `src/features/vehiculos/components/EditVehiculoModal.tsx`

**Responsabilidades**:
- Renderizar modal con formulario
- Cargar datos del vehículo en el formulario
- Manejar cambios en los campos
- Enviar cambios al API
- Mostrar feedback (éxito/error)

**Props**:
```typescript
interface EditVehiculoModalProps {
  isOpen: boolean;              // Controlar visibilidad
  vehiculoId: string | null;    // ID del vehículo a editar
  dropdownData: DropdownData | null; // Opciones para selectores
  onClose: () => void;          // Callback al cerrar
}
```

**Estado Local**:
```typescript
formData: Partial<Vehiculo>     // Datos del formulario
loading: boolean                // Estado de carga
error: string | null            // Mensaje de error
success: boolean                // Bandera de éxito
```

---

## 🎨 Estructura del Formulario

```
┌────────────────────────────────────────────────────┐
│ Editar Vehículo                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│ [Código]        [Nombre]                          │
│ [Marca]         [Modelo]                          │
│ [Año]  [Tipo ▼] [Estado ▼]                        │
│                                                    │
│ ─────────────────────────────────────────────────  │
│ Información Adicional                             │
│                                                    │
│ [Número de Serie]   [Color]                       │
│ [Licencia]          [Seguro Empresa]              │
│ [Póliza]            [Sector ▼]                    │
│                                                    │
│ [Cancelar]          [Guardar Cambios]             │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 📝 Campos Editables

### Información Principal
- **Código**: string (texto)
- **Nombre**: string (texto)
- **Marca**: string (texto)
- **Modelo**: string (texto)
- **Año**: number (numérico)
- **Tipo**: select (dropdown)
- **Estado**: select (dropdown)

### Información Adicional
- **Número de Serie**: number (numérico)
- **Licencia Conductor**: string (texto)
- **Color**: string (texto)
- **Seguro Empresa**: string (texto)
- **Póliza**: string (texto)
- **Sector Pertenencia**: select (dropdown)

---

## 🔄 Integración con VehiculosView

### Estado Nueva
```typescript
// Editar modal
const [editModalOpen, setEditModalOpen] = useState(false);
const [selectedVehiculoIdForEdit, setSelectedVehiculoIdForEdit] = useState<string | null>(null);
```

### Handler Actualizado
```typescript
const handleEdit = (vehiculo: Vehiculo) => {
  setSelectedVehiculoIdForEdit(vehiculo.id_vehiculo);
  setEditModalOpen(true);
};
```

### Modal Agregado
```typescript
<EditVehiculoModal
  isOpen={editModalOpen}
  vehiculoId={selectedVehiculoIdForEdit}
  dropdownData={dropdownData}
  onClose={() => {
    setEditModalOpen(false);
    setSelectedVehiculoIdForEdit(null);
  }}
/>
```

---

## 🔐 Validaciones

### Permisos
- Solo usuarios con rol `admin` o `super-admin` pueden editar
- El botón solo se muestra si el usuario tiene permisos
- El servidor debe validar permisos también

### Campos
- No hay validación en el cliente (opcional)
- El servidor debe validar formato, rangos, etc.

### Estados
- Los campos se deshabilitan mientras se envían cambios
- Los botones se deshabilitan durante el envío
- Los campos se habilitan nuevamente en caso de error

---

## 📊 Estados de la UI

### Estado Normal
```
- Campos habilitados
- Botones habilitados
- Sin mensajes de error/éxito
```

### Estado de Carga
```
- Campos deshabilitados
- Botones deshabilitados
- Loading spinner en botón Guardar
```

### Estado de Éxito
```
- Mensaje verde: "¡Vehículo actualizado correctamente!"
- Modal se cierra después de 1.5 segundos
- Store se actualiza automáticamente
```

### Estado de Error
```
- Mensaje rojo con descripción del error
- Campos se habilitan nuevamente
- Modal permanece abierto
- Usuario puede intentar nuevamente
```

---

## 🔗 Integración con Store

### Método Utilizado: `updateVehiculo()`

```typescript
updateVehiculo: async (id: string, vehiculo: Partial<Vehiculo>) => {
  try {
    const updated = await vehiculosService.update(id, vehiculo);
    // Actualizar store
    const vehiculos = get().vehiculos.map((v) => (v.id === id ? updated : v));
    const filtered = applyFilters(vehiculos, get().filters);
    set({ vehiculos, filteredVehiculos: filtered });
  } catch (error) {
    throw new Error(message);
  }
};
```

### Comportamiento
1. Llama a `vehiculosService.update()` con PATCH
2. Actualiza el array `vehiculos`
3. Re-aplica los filtros
4. Actualiza `filteredVehiculos`
5. Los cambios se reflejan en el grid automáticamente

---

## 📡 API Endpoint

### PATCH /vehiculos/{id}

**URL**: `/vehiculos/{id}`  
**Método**: PATCH  
**Autenticación**: Requerida  
**Permisos**: Admin o Super Admin

**Body Esperado**:
```json
{
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
  }
}
```

**Respuesta Exitosa** (200 OK):
```json
{
  "success": true,
  "data": { ...vehiculo actualizado... },
  "message": "Vehículo actualizado correctamente"
}
```

**Errores Posibles**:
- `400 Bad Request`: Datos inválidos
- `401 Unauthorized`: Token expirado
- `403 Forbidden`: Sin permisos
- `404 Not Found`: Vehículo no existe
- `500 Internal Server Error`: Error del servidor

---

## 🧪 Tests Incluidos

**Archivo**: `src/features/vehiculos/__tests__/EditVehiculoModal.test.tsx`

**Cobertura**:
- ✅ No renderiza cuando isOpen=false
- ✅ Renderiza cuando isOpen=true
- ✅ Carga datos del vehículo
- ✅ Permite editar campos
- ✅ Maneja envío del formulario
- ✅ Cierra modal al cancelar
- ✅ Muestra error en caso de fallo
- ✅ Muestra éxito y cierra modal

---

## 🚀 Cómo Usar

### 1. Abrir Modal de Edición
```
1. En el grid de vehículos
2. Hacer click en botón azul de lápiz
3. Se abre el modal con los datos del vehículo
```

### 2. Editar Información
```
1. Cambiar los campos deseados
2. Los valores se actualizan en tiempo real
3. Los dropdowns tienen las opciones del sistema
```

### 3. Guardar Cambios
```
1. Click en "Guardar Cambios"
2. Esperar a que se envíen los datos
3. Ver mensaje de confirmación
4. Modal se cierra automáticamente
5. Grid se actualiza con los nuevos datos
```

### 4. Manejo de Errores
```
1. Si hay error, ver mensaje en rojo
2. Corregir los datos si es necesario
3. Intentar guardar nuevamente
4. O cancelar y cerrar modal
```

---

## 💡 Características Destacadas

1. **Pre-carga de Datos**: El formulario se llena automáticamente con los datos actuales
2. **Edición de Anidados**: Se pueden editar campos dentro de infoAdicional
3. **Feedback Inmediato**: Mensajes de éxito/error claros
4. **Auto-cierre**: El modal se cierra automáticamente en caso de éxito
5. **Deshabilitar Interacción**: Durante el envío, todos los campos se deshabilitan
6. **Re-aplicar Filtros**: Los cambios se reflejan en tiempo real en el grid

---

## 🔍 Debugging

### Si el modal no se abre
```
Verificar:
- El botón editar está siendo clickeado ✓
- handleEdit() se ejecuta correctamente
- setEditModalOpen(true) se llama
- vehiculoId está correctamente asignado
```

### Si los datos no cargan
```
Verificar:
- vehiculoId existe en el store
- El vehículo se encuentra en vehiculos array
- useEffect se ejecuta cuando el modal se abre
```

### Si los cambios no se guardan
```
Verificar:
- updateVehiculo() se ejecuta
- El servidor responde correctamente
- El error está siendo capturado correctamente
```

---

## 📈 Próximas Mejoras Posibles

1. Validación de campos en el cliente
2. Indicador de cambios sin guardar
3. Deshacer cambios (revert)
4. Historial de cambios
5. Campos read-only según permisos
6. Auto-save periódico
7. Confirmación si hay cambios sin guardar

---

## 🎯 Requisitos Cumplidos

✅ Modal se despliega al hacer click en editar  
✅ Usa ID del vehículo para identificar  
✅ Obtiene datos del store  
✅ Formulario pre-poblado con datos  
✅ Campos habilitados para escribir  
✅ Botón guardar llama al endpoint  
✅ Feedback de éxito: mensaje + cierra modal  
✅ Feedback de error: mensaje + mantiene abierto  
✅ Validación de permisos (solo admin puede editar)  
✅ Tests unitarios incluidos  

---

## 📞 Soporte

Para problemas o preguntas sobre esta funcionalidad, revisar:
- Logs de la consola del navegador
- Estado del store en React DevTools
- Requests/responses en Network tab
- Tests para entender el comportamiento esperado
