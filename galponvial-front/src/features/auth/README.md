# Login Screen - Quick Reference

## File Structure
```
src/features/auth/
├── pages/
│   └── LoginPage.tsx          # Login UI component
├── services/
│   └── authService.ts         # API calls and token management
├── hooks/
│   └── useLogin.ts           # Login logic hook
├── validationSchema.ts        # Yup validation rules
├── types.ts                  # TypeScript interfaces
└── __tests__/
    ├── LoginPage.test.tsx
    ├── authService.test.ts
    └── validationSchema.test.ts
```

## How It Works

### 1. User Submits Login Form
```tsx
<LoginPage /> at route /login
```

### 2. Form Validation
- DNI: Required, positive integer
- Password: Required, 8+ chars, uppercase, lowercase, number

### 3. Login Request
```
POST /usuario/login
{ dni: 37766524, password: "eljovEnquenunc4fue" }
```

### 4. Token Storage
- **Access Token** → localStorage `accessToken` (used in Authorization header)
- **Refresh Token** → HttpOnly cookie (automatically handled)

### 5. Redirect
- Success → Home page (`/`)
- Failure → Show error message

### 6. Automatic Token Refresh
- API interceptor detects 401 responses
- Automatically calls `/usuario/refresh`
- Updates token and retries request
- If refresh fails → logout and redirect to login

## Using the Login Hook

```tsx
import { useLogin } from '@/features/auth/hooks/useLogin';

const { login, loading, error, clearError } = useLogin();

// Call login
await login(37766524, 'ValidPassword123');
```

## API Endpoints Required

### Login
```
POST /usuario/login
Request: { dni: number, password: string }
Response: {
  success: boolean,
  data: { dni, accessToken, refreshToken },
  message?: string
}
```

### Token Refresh (for auto-refresh)
```
POST /usuario/refresh
Response: {
  success: boolean,
  data: { accessToken },
  message?: string
}
```

## Styling
- Colors from project palette
- TailwindCSS + CSS variables
- Responsive design
- Mobile-friendly

## Environment Variables
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Testing
```bash
# Run all auth tests
pnpm test -- src/features/auth/__tests__

# Run specific test
pnpm test -- src/features/auth/__tests__/validationSchema.test.ts

# Build
pnpm run build

# Lint
pnpm run lint

# Dev server
pnpm run dev
```

## Security Features
- Tokens in localStorage/cookies (secure HTTP header)
- Automatic token refresh
- CORS with credentials
- Automatic logout on token expiration

## Next: Protected Routes
To protect admin/user pages:

```tsx
// Create ProtectedRoute component
// Check localStorage for accessToken
// Redirect to /login if not authenticated
```

## Password Validation Regex
```regex
/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
```
- Uppercase: `(?=.*[A-Z])`
- Lowercase: `(?=.*[a-z])`
- Number or special: `(?=.*\d)|(?=.*\W+)`
- Minimum 8 chars: `.{8,}`
