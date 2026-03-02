# Almacén Error Handling Improvements

## Overview
Improved error feedback throughout the almacén (warehouse) module to display specific permission-based messages instead of generic "error al cargar los datos" messages.

## Changes Made

### 1. Enhanced Error Handler (`src/services/errorHandler.ts`)

**New Features:**
- **Permission Error Detection**: Detects 403 Forbidden status automatically
- **Permission Extraction**: Extracts required permission from error response
- **User-Friendly Messages**: Formats permission names into readable Spanish messages
- **New ApiError Interface Properties**:
  - `requiredPermission?: string` - Extracted permission requirement
  - `isPermissionError?: boolean` - Flag to differentiate permission errors

**Permission Message Mapping:**
- `almacen-comun:read` → "visualizar artículos del almacén común"
- `almacen-comun:write` → "administrar artículos del almacén común"
- `almacen-taller:read` → "visualizar artículos del taller"
- `almacen-taller:write` → "administrar artículos del taller"
- `all:read` → "visualizar datos del sistema"
- `all:write` → "administrar datos del sistema"

**Error Extraction Patterns:**
Looks for permission in error response using these patterns:
1. `errorData.requiredPermission`
2. `errorData.permission`
3. `errorData.detail.permission`
4. Parsed from error message (e.g., "Requires permission: almacen-comun:read")

### 2. Updated Components

#### VisualizarAlmacen.tsx
- Imports `handleApiError` and `ApiError` type
- Changed error state from `Error | null` to `ApiError | null`
- Improved error display with:
  - Permission error icon (🔒) vs warning icon (⚠️)
  - Different color scheme for permission errors (amber) vs other errors (red)
  - Technical details drawer for debugging
  - Clear distinction between "Permiso Insuficiente" and "Error al Cargar"

#### CreateGrupoArticuloForm.tsx
- Imports `handleApiError` and `ApiError` type
- Changed error state from `string | null` to `ApiError | null`
- Updated error displays:
  - Fetch sectores errors now show specific permission messages
  - Validation errors marked as non-permission errors
  - Improved visual feedback with icons and color coding

#### CreateArticuloForm.tsx
- Imports `handleApiError` and `ApiError` type
- Changed error state from `string | null` to `ApiError | null`
- Updated three error display areas:
  - Main error display (centered, with icon)
  - Grupos loading error (in select field area)
  - Validation errors marked as non-permission errors

#### EditArticuloModal.tsx
- Imports `handleApiError` and `ApiError` type
- Changed error state from `string | null` to `ApiError | null`
- Updated error display with:
  - Permission error icon (🔒) vs warning icon (⚠️)
  - Color-coded messages (amber for permissions, red for other errors)
  - Consistent styling with other components

### 3. Error Display Pattern

All improved components now display errors with consistent visual hierarchy:

```tsx
{error && (
  <div className={`mb-6 p-4 border rounded-lg flex items-start gap-3 ${
    error.isPermissionError 
      ? 'bg-amber-50 border-amber-200' 
      : 'bg-red-50 border-red-200'
  }`}>
    <span className="text-2xl mt-0.5">
      {error.isPermissionError ? '🔒' : '⚠️'}
    </span>
    <div className={error.isPermissionError ? 'text-amber-900' : 'text-red-800'}>
      <p className="font-medium">
        {error.isPermissionError ? 'Permiso Insuficiente' : 'Error'}
      </p>
      <p className="text-sm">{error.message}</p>
    </div>
  </div>
)}
```

## User Experience Improvements

### Before
- All almacén errors displayed generic "Error al cargar los datos"
- No indication of specific permission needed
- Users confused about why they couldn't access features

### After
- **Permission Denied (403)**: 
  - Clear message: "No tienes permiso para visualizar artículos del almacén común"
  - Visual icon (🔒) to indicate security/permission issue
  - Amber color coding for quick recognition

- **Other Errors**:
  - Original technical error message preserved
  - Visual icon (⚠️) to indicate warning/error
  - Red color coding for danger
  - Optional technical details drawer for debugging

## Validation Errors

All form validation errors are marked as `isPermissionError: false` and display with warning icon (⚠️):
- Missing required fields
- Invalid stock values
- Missing selections (grupo, sector)

## Backend Integration

The error handler expects one of these response formats from the backend:

```json
{
  "message": "Error message",
  "requiredPermission": "almacen-comun:read"
}
```

Or:

```json
{
  "message": "Requires permission: almacen-comun:read"
}
```

## Testing Scenarios

When testing, verify:

1. **403 Permission Denied**: Check that specific permission is extracted and displayed
   - Try accessing almacén without `almacen-taller:read` permission
   - Verify message shows "No tienes permiso para..."

2. **500/Generic Error**: Check that error is displayed with warning icon
   - Backend error should preserve original message

3. **Validation Errors**: Check that validation errors show warning icon
   - Try submitting form with empty fields
   - Verify amber color and permission icon not shown

4. **Network Errors**: Check graceful handling
   - Disconnect network and retry
   - Verify generic error message displayed with details drawer

## Files Modified

1. `/src/services/errorHandler.ts` - Core error handling improvements
2. `/src/features/almacen/components/VisualizarAlmacen.tsx` - Main display component
3. `/src/features/almacen/components/CreateGrupoArticuloForm.tsx` - Create grupo form
4. `/src/features/almacen/components/CreateArticuloForm.tsx` - Create articulo form
5. `/src/features/almacen/components/EditArticuloModal.tsx` - Edit articulo modal

## Type Safety

All error handling now uses properly typed `ApiError` interface instead of generic strings, providing:
- Better IDE autocomplete
- Compile-time type checking
- Reduced runtime errors
- Clearer intent in code

## Future Enhancements

Potential improvements for future iterations:

1. **Localization**: Convert Spanish messages to i18n for multi-language support
2. **Error Logging**: Send permission errors to analytics for user support
3. **Retry Logic**: Offer retry button for non-permission errors
4. **Permission Info**: Link to help documentation explaining required permissions
5. **Auto-logout**: Handle 401 Unauthorized with automatic logout and login redirect
