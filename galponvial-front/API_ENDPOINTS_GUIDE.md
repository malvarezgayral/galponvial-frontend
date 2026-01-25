# Guía de Integración - Endpoints API para Vehículos

## Endpoints Esperados

### 1. GET /vehiculos
**Descripción**: Obtiene el listado completo de vehículos

**Método**: GET  
**URL**: `/vehiculos`  
**Autenticación**: Requerida (Bearer Token)

**Respuesta Esperada** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "codigo": "VH001",
      "nombre": "Camioneta Municipal 1",
      "marca": "Toyota",
      "modelo": "Hilux",
      "anio": 2020,
      "tipo_vehiculo": "camioneta",
      "status": "disponible",
      "infoAdicional": {
        "numero_serie": 123456789,
        "licencia_conductor": "ABC123456",
        "color": "blanco",
        "seguro_empresa": "Seguros SA",
        "poliza": "POL-2024-001",
        "id_sector_pertenencia": 1
      },
      "fechaCreacion": "2024-01-15T10:30:00Z",
      "ultimaModificacion": "2024-01-20T14:45:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "codigo": "VH002",
      "nombre": "Auto Municipal 1",
      "marca": "Ford",
      "modelo": "Focus",
      "anio": 2021,
      "tipo_vehiculo": "auto",
      "status": "en_uso",
      "infoAdicional": {
        "numero_serie": 987654321,
        "licencia_conductor": "XYZ987654",
        "color": "rojo",
        "seguro_empresa": "Seguros SA",
        "poliza": "POL-2024-002",
        "id_sector_pertenencia": 2
      },
      "fechaCreacion": "2024-01-16T11:00:00Z",
      "ultimaModificacion": "2024-01-21T09:15:00Z"
    }
  ],
  "message": "15 total de vehículos"
}
```

**Códigos de Error**:
- `401 Unauthorized`: Token inválido o expirado
- `403 Forbidden`: Sin permisos
- `500 Internal Server Error`: Error del servidor

---

### 2. PATCH /vehiculos/{id}
**Descripción**: Actualiza parcialmente un vehículo

**Método**: PATCH  
**URL**: `/vehiculos/{id}`  
**Autenticación**: Requerida (Bearer Token)  
**Permisos**: Admin o Super Admin

**Body (ejemplo con todos los campos opcionales)**:
```json
{
  "codigo": "VH001",
  "nombre": "Camioneta Municipal 1 - Actualizada",
  "marca": "Toyota",
  "modelo": "Hilux",
  "anio": 2020,
  "tipo_vehiculo": "camioneta",
  "status": "mantenimiento",
  "uso_combustible": 150.5,
  "uso_km": 45000,
  "infoAdicional": {
    "numero_serie": 123456789,
    "licencia_conductor": "ABC123456",
    "color": "blanco",
    "seguro_empresa": "Seguros SA",
    "poliza": "POL-2024-001",
    "id_sector_pertenencia": 2
  }
}
```

**Body (ejemplo mínimo)**:
```json
{
  "nombre": "Camioneta Municipal 1 - Actualizada",
  "status": "mantenimiento"
}
```

**Respuesta Esperada** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "codigo": "VH001",
    "nombre": "Camioneta Municipal 1 - Actualizada",
    "marca": "Toyota",
    "modelo": "Hilux",
    "anio": 2020,
    "tipo_vehiculo": "camioneta",
    "status": "mantenimiento",
    "infoAdicional": {
      "numero_serie": 123456789,
      "licencia_conductor": "ABC123456",
      "color": "blanco",
      "seguro_empresa": "Seguros SA",
      "poliza": "POL-2024-001",
      "id_sector_pertenencia": 2
    },
    "fechaCreacion": "2024-01-15T10:30:00Z",
    "ultimaModificacion": "2024-01-22T16:20:00Z"
  },
  "message": "Vehículo actualizado correctamente"
}
```

**Códigos de Error**:
- `400 Bad Request`: Datos inválidos
- `401 Unauthorized`: Token inválido
- `403 Forbidden`: Sin permisos o no es admin
- `404 Not Found`: Vehículo no existe
- `500 Internal Server Error`: Error del servidor

---

### 3. DELETE /vehiculos/{id}
**Descripción**: Elimina un vehículo

**Método**: DELETE  
**URL**: `/vehiculos/{id}`  
**Autenticación**: Requerida (Bearer Token)  
**Permisos**: Admin o Super Admin

**Body**: No requiere body

**Respuesta Esperada** (200 OK):
```json
{
  "success": true,
  "message": "Vehículo eliminado correctamente"
}
```

**Respuesta Alternativa** (con datos del vehículo eliminado):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "codigo": "VH001",
    "nombre": "Camioneta Municipal 1",
    "marca": "Toyota",
    "modelo": "Hilux"
  },
  "message": "Vehículo eliminado correctamente"
}
```

**Códigos de Error**:
- `401 Unauthorized`: Token inválido
- `403 Forbidden`: Sin permisos o no es admin
- `404 Not Found`: Vehículo no existe
- `500 Internal Server Error`: Error del servidor

---

## Ejemplos de Uso en cURL

### Obtener todos los vehículos
```bash
curl -X GET http://localhost:3000/api/vehiculos \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

### Actualizar un vehículo
```bash
curl -X PATCH http://localhost:3000/api/vehiculos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "mantenimiento",
    "nombre": "Camioneta Actualizada"
  }'
```

### Eliminar un vehículo
```bash
curl -X DELETE http://localhost:3000/api/vehiculos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Estructura de Tipos TypeScript

```typescript
interface Vehiculo {
  id: string;
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo_vehiculo: 'camioneta' | 'auto' | 'camion' | 'moto' | 'utilitario';
  status: 'disponible' | 'mantenimiento' | 'en_uso' | 'retirado';
  infoAdicional: {
    numero_serie: number;
    licencia_conductor: string;
    color: string;
    seguro_empresa: string;
    poliza: string;
    id_sector_pertenencia: number;
  };
  fechaCreacion?: string;
  ultimaModificacion?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}
```

---

## Validaciones Esperadas en Backend

### Para PATCH /vehiculos/{id}

1. **Validar que el usuario es Admin o Super Admin**
   - Si no: Retornar `403 Forbidden`

2. **Validar formato del ID**
   - Si es inválido: Retornar `400 Bad Request`

3. **Validar que el vehículo existe**
   - Si no existe: Retornar `404 Not Found`

4. **Validar datos en el body**
   - `codigo`: string, única en BD
   - `nombre`: string, requerido si se envía
   - `anio`: number entre 1900 y año actual
   - `status`: debe ser uno de los valores válidos
   - `infoAdicional.id_sector_pertenencia`: número válido

5. **Actualizar timestamps**
   - `ultimaModificacion`: fecha actual

### Para DELETE /vehiculos/{id}

1. **Validar que el usuario es Admin o Super Admin**
   - Si no: Retornar `403 Forbidden`

2. **Validar formato del ID**
   - Si es inválido: Retornar `400 Bad Request`

3. **Validar que el vehículo existe**
   - Si no existe: Retornar `404 Not Found`

4. **Optativo: Validar que el vehículo no tiene referencias**
   - En otras tablas (auditoría, mantenimiento, etc.)
   - Si tiene referencias: Retornar `409 Conflict` con mensaje

---

## Headers Esperados

Todas las requests deben incluir:

```
Content-Type: application/json
Authorization: Bearer {access_token}
```

Si el token es expirado, el interceptor de axios automáticamente:
1. Intenta refrescar el token
2. Si tiene éxito, reintenta la request original
3. Si falla, redirige a login

---

## Notas Importantes

1. **Respuesta GET /vehiculos**: 
   - Puede retornar array directamente o envuelto en `{success, data}`
   - El servicio maneja ambos casos

2. **PATCH vs PUT**:
   - Usamos PATCH (actualización parcial)
   - No es necesario enviar todos los campos

3. **Permisos**:
   - Ver: Cualquier usuario autenticado
   - Editar (PATCH): Solo Admin o Super Admin
   - Eliminar (DELETE): Solo Admin o Super Admin

4. **Validación Cliente vs Servidor**:
   - Cliente: Muestra/oculta UI según permisos
   - Servidor: Debe validar permisos también
   - El cliente NO confía en la validación de permisos

5. **Filtros**:
   - Todos los filtros se aplican en el cliente
   - No se envían parámetros de query al servidor
   - Se obtiene TODO el listado y se filtra localmente

---

## Status de Vehículos

```
disponible     = Verde (#80DD4B)  - Listo para usar
mantenimiento  = Amarillo (#EAB308) - En mantenimiento
en_uso         = Azul (#3B82F6)   - Actualmente en uso
retirado       = Rojo (#EF4444)   - Fuera de servicio
```

---

## Ejemplos de Respuesta de Error

### Error de Permiso
```json
{
  "success": false,
  "message": "No tienes permiso para eliminar vehículos. Requiere rol: admin"
}
```

### Error de Validación
```json
{
  "success": false,
  "message": "El código de vehículo debe ser único",
  "errors": {
    "codigo": "Ya existe un vehículo con este código"
  }
}
```

### Error de No Encontrado
```json
{
  "success": false,
  "message": "Vehículo no encontrado con ID: 550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Testing en Postman

### Pre-request Script para obtener token

```javascript
// Obtener token del localStorage (si está disponible)
pm.sendRequest({
    url: pm.environment.get("base_url") + "/usuario/login",
    method: "POST",
    header: {
        "Content-Type": "application/json"
    },
    body: {
        mode: "raw",
        raw: JSON.stringify({
            email: "admin@test.com",
            password: "123456"
        })
    }
}, (err, response) => {
    if (!err) {
        const token = response.json().data.accessToken;
        pm.environment.set("access_token", token);
    }
});
```

### Usar en requests
- Header: `Authorization: Bearer {{access_token}}`

---

## Status Codes HTTP a Implementar

- `200 OK`: Éxito (GET, PATCH, DELETE)
- `201 Created`: Recurso creado (POST) - no usado aquí
- `204 No Content`: Éxito sin body (opcional para DELETE)
- `400 Bad Request`: Datos inválidos
- `401 Unauthorized`: Necesita autenticación
- `403 Forbidden`: Sin permisos
- `404 Not Found`: Recurso no existe
- `409 Conflict`: Conflicto (ej: código duplicado)
- `500 Internal Server Error`: Error del servidor
