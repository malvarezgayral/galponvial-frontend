# Implementación de Grupos en Formulario de Crear Artículo

## Resumen de Cambios

Se ha implementado un nuevo campo dropdown de grupos en el formulario de crear artículos del módulo de almacén. Los grupos se obtienen dinámicamente del endpoint `/almacen/grupos` y se envían como `grupo_id` en la solicitud de creación de artículos.

## Archivos Modificados

### 1. `src/features/almacen/types.ts`

**Nuevas interfaces:**
```typescript
export interface Sector {
  id: number;
  nro_sector: number;
  tipo: string;
  descripcion: string;
}

export interface Grupo {
  id: number;
  nombre: string;
  descripcion: string;
  sector: Sector;
}
```

**Actualización:**
```typescript
export interface CreateArticuloPayload {
  // ... campos existentes ...
  grupo_id: number;  // ✓ NUEVO
}
```

### 2. `src/features/almacen/services/almacenService.ts`

**Nuevas constantes:**
```typescript
const GRUPOS_URL = '/almacen/grupos';
```

**Nuevo método:**
```typescript
getGrupos: async (): Promise<Grupo[]> => {
  const { data } = await apiClient.get(GRUPOS_URL);
  return data.data || data;
}
```

**Importación actualizada:**
```typescript
import type { CreateArticuloPayload, ArticuloResponse, ArticulosListResponse, Grupo } from '../types';
```

### 3. `src/features/almacen/components/CreateArticuloForm.tsx`

**Imports actualizados:**
```typescript
import { useState, useEffect } from 'react';  // ✓ useEffect agregado
import type { UnidadTipoOption, Grupo } from '../types';  // ✓ Grupo agregado
```

**Nuevos estados:**
```typescript
const [grupoId, setGrupoId] = useState<number | ''>('');
const [grupos, setGrupos] = useState<Grupo[]>([]);
const [gruposLoading, setGruposLoading] = useState(true);
const [gruposError, setGruposError] = useState<string | null>(null);
```

**Hook de carga de grupos:**
```typescript
useEffect(() => {
  const fetchGrupos = async () => {
    try {
      const data = await almacenService.getGrupos();
      setGrupos(data);
      setGruposError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar grupos';
      setGruposError(errorMessage);
    } finally {
      setGruposLoading(false);
    }
  };
  fetchGrupos();
}, []);
```

**Validación en handleSubmit:**
```typescript
if (!grupoId) {
  setError('Debe seleccionar un grupo');
  return;
}
```

**Inclusión en payload:**
```typescript
const payload = {
  // ... campos existentes ...
  grupo_id: grupoId as number,  // ✓ NUEVO
  // ...
};
```

**Elemento UI del dropdown:**
```tsx
<div>
  <label htmlFor="grupo" className="block text-sm font-medium text-gray-700 mb-2">
    Grupo *
  </label>
  {gruposError && (
    <div className="text-red-600 text-sm mb-2">{gruposError}</div>
  )}
  <select
    id="grupo"
    value={grupoId}
    onChange={(e) => setGrupoId(e.target.value ? parseInt(e.target.value, 10) : '')}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    disabled={loading || gruposLoading}
  >
    <option value="">
      {gruposLoading ? 'Cargando grupos...' : 'Seleccionar grupo'}
    </option>
    {grupos.map((grupo) => (
      <option key={grupo.id} value={grupo.id}>
        {grupo.nombre} ({grupo.sector.tipo})
      </option>
    ))}
  </select>
  {gruposLoading && (
    <p className="text-xs text-gray-500 mt-1">Cargando grupos disponibles...</p>
  )}
</div>
```

**Limpieza de estado:**
- En `handleClearForm`: `setGrupoId('');`
- Después de submit exitoso: incluido en el `setTimeout` de limpieza

## Comportamiento

✅ **Carga automática:** Los grupos se cargan cuando el componente se monta  
✅ **Campo obligatorio:** No permite enviar sin seleccionar grupo  
✅ **Mostrar sector:** Cada opción del dropdown muestra "Nombre del Grupo (tipo_sector)"  
   - Ejemplo: "Repuestos (almacen-taller)"  
✅ **Manejo de errores:** Muestra mensaje legible al usuario si la carga falla  
✅ **Estado de carga:** El dropdown se deshabilita mientras carga  
✅ **TypeScript strict:** Totalmente tipado, sin `any`

## Endpoint esperado

```
GET /almacen/grupos
```

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "nombre": "Repuestos",
    "descripcion": "Repuestos y componentes para vehículos",
    "sector": {
      "id": 1,
      "nro_sector": 1,
      "tipo": "almacen-taller",
      "descripcion": "repuestos de automotores"
    }
  },
  {
    "id": 2,
    "nombre": "Neumaticos",
    "descripcion": "Neumáticos y llantas",
    "sector": {
      "id": 2,
      "nro_sector": 2,
      "tipo": "almacen-comun",
      "descripcion": "articulos de limpieza"
    }
  }
]
```

## Payload de creación de artículo

El nuevo payload ahora incluye `grupo_id`:

```json
{
  "cod_proveedor": "ART-001",
  "nombre": "Taladro",
  "modelo": "Bosch X200",
  "descripcion": "Descripción del artículo",
  "unidad_tipo": "pieza",
  "grupo_id": 1,
  "img": "https://ejemplo.com/imagen.jpg"
}
```

## Notas de implementación

- El campo de grupos es obligatorio
- Se usa `useState<number | ''>('')` para permitir el estado vacío inicial
- El parsing a número se hace en el onChange del select con `parseInt(e.target.value, 10)`
- La conversión final a número se hace en el payload con `as number` 
- Los errores de carga se muestran encima del select
- El loading state del formulario general deshabilita el select

