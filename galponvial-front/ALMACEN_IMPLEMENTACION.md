# Implementación de Almacén - Pantalla de Gestión

## Resumen General
Se ha creado la pantalla de **Almacén** siguiendo la estructura y estilos de la pantalla de **Vehículos**. La pantalla incluye:

1. **Toggle Button** - Para cambiar entre "Administrar Almacén" y "Visualizar Almacén"
2. **Formulario de Creación** - Para agregar nuevos artículos al almacén
3. **Visualización** - Para ver todos los artículos registrados

---

## Estructura de Archivos Creados

### 1. **almacen/types.ts**
**Ubicación**: `src/features/almacen/types.ts`

Define las interfaces TypeScript:
- `Articulo` - Interfaz principal de artículo
- `CreateArticuloPayload` - Payload para crear artículos
- `ArticuloResponse` - Respuesta del servidor
- `ArticulosListResponse` - Respuesta paginada
- `UnidadTipoOption` - Opciones de unidad con info de requerimiento de stock

**Tipos de Unidad Disponibles**:
- `pieza` - No requiere stock
- `caja` - Requiere stock
- `bulto` - Requiere stock
- `metro` - No requiere stock
- `litro` - Requiere stock
- `kg` - Requiere stock

### 2. **almacen/services/almacenService.ts**
**Ubicación**: `src/features/almacen/services/almacenService.ts`

Servicio de API con métodos:
- `getArticulos(page, pageSize)` - Obtener artículos con paginación
- `getArticuloById(id)` - Obtener un artículo específico
- `createArticulo(payload)` - Crear un nuevo artículo **[POST /almacen/articulos]**
- `updateArticulo(id, payload)` - Actualizar artículo
- `deleteArticulo(id)` - Eliminar artículo

### 3. **almacen/components/CreateArticuloForm.tsx**
**Ubicación**: `src/features/almacen/components/CreateArticuloForm.tsx`

**Campos del Formulario**:
- **Código Proveedor** (requerido) - Text input, ej: "ART-001"
- **Nombre** (requerido) - Text input, ej: "Taladro"
- **Modelo** (requerido) - Text input, ej: "Bosch X200"
- **Tipo de Unidad** (requerido) - Select con 6 opciones
- **Descripción** (requerido) - Textarea para descripción detallada
- **Stock** (condicional) - Se muestra solo si el tipo de unidad lo requiere
- **URL de Imagen** (opcional) - Para proporcionar imagen del artículo

**Funcionalidades**:
✅ Validación completa de campos obligatorios
✅ Validación condicional de stock según tipo de unidad
✅ Conversión automática de tipos (stock como número)
✅ Mensaje de éxito con auto-cierre después de 1.5s
✅ Mensajes de error detallados
✅ Limpieza automática del formulario después de éxito
✅ Botón "Limpiar" con confirmación
✅ Estado de loading en botones y campos
✅ Callback `onSuccess` para refrescar datos

**Comportamiento**:
- Si stock es requerido y la unidad se cambia a una que no lo requiere, se limpia el valor
- Los errores mantienen los valores del formulario para corrección
- El success muestra mensaje por 1.5s antes de limpiar

### 4. **almacen/components/VisualizarAlmacen.tsx**
**Ubicación**: `src/features/almacen/components/VisualizarAlmacen.tsx`

**Características**:
- Tabla con paginación inicial de 10 artículos
- Columnas: Código, Nombre, Modelo, Descripción, Unidad, Stock, Acciones
- Carga automática de datos al montar el componente
- Estados: loading, error, empty (sin artículos)
- Botones de Editar y Eliminar (placeholders para futuras implementaciones)
- Responsive con scroll horizontal en mobile

### 5. **almacen/pages/AlmacenPage.tsx** (Actualizado)
**Ubicación**: `src/features/almacen/pages/AlmacenPage.tsx`

**Componentes**:
1. **Toggle Button** - Cambio entre vistas
   - "Administrar Almacén" - Muestra formulario de creación
   - "Visualizar Almacén" - Muestra tabla de artículos
   
2. **Estados**:
   - `currentView` - Vista actual activa
   - `refetchTrigger` - Para refrescar visualizar cuando se crea un artículo

3. **Estilos**:
   - Toggle buttons con Tailwind CSS
   - Botón activo con background azul y sombra
   - Transiciones suaves

---

## Flujo de Uso

### Crear Artículo:
1. Usuario hace clic en "Administrar Almacén"
2. Se muestra formulario de creación
3. Usuario completa todos los campos requeridos
4. Si tipo de unidad requiere stock, debe ingresar cantidad
5. Al enviar:
   - Se validan todos los campos
   - Se hace POST a `/almacen/articulos`
   - Muestra mensaje de éxito por 1.5s
   - Limpia formulario automáticamente
   - Llama callback onSuccess
6. Si hay error:
   - Mantiene valores del formulario
   - Muestra mensaje de error
   - No cierra el formulario

### Visualizar Artículos:
1. Usuario hace clic en "Visualizar Almacén"
2. Se carga tabla de artículos
3. Se muestran todos los artículos con sus datos
4. Disponibles botones de editar y eliminar (para implementar)

---

## Body de Ejemplo (Payload POST)

```json
{
  "cod_proveedor": "ART-001",
  "nombre": "Taladro",
  "modelo": "Bosch X200",
  "descripcion": "Taladro eléctrico industrial de alta potencia",
  "unidad_tipo": "caja",
  "stock": 8,
  "img": "https://ejemplo.com/taladro.jpg"
}
```

**Notas**:
- `img` es opcional (se usa undefined si no se proporciona)
- `stock` solo se incluye si `unidad_tipo` lo requiere
- Los valores se trimean para evitar espacios extras

---

## Validaciones Implementadas

1. **Campos obligatorios**: cod_proveedor, nombre, modelo, descripcion, unidad_tipo
2. **Stock condicional**: Obligatorio si unidad_tipo lo requiere, debe ser > 0
3. **URL de imagen**: Se valida solo si se proporciona (tipo URL)
4. **Campos de texto**: Trimeo automático de espacios

---

## Estilos y Diseño

- **Formulario**: Seguidor del patrón de Vehículos
- **Colores**: Azul para botones primarios, gris para secundarios
- **Responsive**: Grid 1 columna en mobile, 2 en desktop
- **Feedback**: 
  - Error en rojo (bg-red-50, border-red-200)
  - Success en verde (bg-green-50, border-green-200)
- **Loading**: Spinner animado + texto "Cargando..."

---

## Próximos Pasos Sugeridos

1. ⏳ Implementar edición de artículos (PUT)
2. ⏳ Implementar eliminación de artículos (DELETE) con confirmación
3. ⏳ Agregar búsqueda/filtrado en tabla
4. ⏳ Agregar paginación completa en tabla
5. ⏳ Subida de imágenes (en lugar de URL)
6. ⏳ Exportar datos a CSV/Excel
7. ⏳ Historial de movimientos de stock
8. ⏳ Alertas de bajo stock

---

## Notas de Implementación

- ✅ Sin dependencias externas adicionales
- ✅ Tipos TypeScript estrictos
- ✅ Siguiendo arquitectura del proyecto
- ✅ Reutilización de componentes UI (Button)
- ✅ Estilos consistentes con Tailwind CSS
- ✅ Manejo robusto de errores
- ✅ UX amigable con feedback claro
