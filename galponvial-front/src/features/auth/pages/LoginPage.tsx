import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { loginValidationSchema, type LoginFormValues } from '../validationSchema';
import { Button } from '@/shared/ui/Button';

/**
 * Login page component
 * Handles user authentication with DNI and password
 */
const LoginPage: React.FC = () => {
  const { login, loading, error, clearError } = useLogin();
  const [formData, setFormData] = useState<LoginFormValues>({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    clearError();

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setValidationErrors({});

    try {
      // Validate form data
      const validatedData = await loginValidationSchema.validate(formData, { abortEarly: false });

      // Call login function
      await login(validatedData.email, validatedData.password);
    } catch (validationError) {
      // Handle validation errors
      if (validationError instanceof Error && 'inner' in validationError) {
        const yupErrors = (validationError as { inner: Array<{ path: string; message: string }> }).inner;
        const errorMap: Record<string, string> = {};

        yupErrors.forEach((err) => {
          if (err.path) {
            errorMap[err.path] = err.message;
          }
        });

        setValidationErrors(errorMap);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#E3F2FD] to-[#B3E5FC]">
      <div className="w-full max-w-md px-6">
        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Form Title */}
          <h1 className="text-center text-2xl font-bold text-[#1E1E1E] mb-8">Galpon Vial</h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                  validationErrors.email
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-[#88BAFF] bg-[#E3F2FD] text-[#1E1E1E] placeholder-[#474444] focus:border-[#378AFE]'
                }`}
                disabled={loading}
              />
              {validationErrors.email && (
                <p className="text-red-600 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                  validationErrors.password
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-[#88BAFF] bg-[#E3F2FD] text-[#1E1E1E] placeholder-[#474444] focus:border-[#378AFE]'
                }`}
                disabled={loading}
              />
              {validationErrors.password && (
                <p className="text-red-600 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full bg-[#378AFE] hover:bg-[#0962DE] font-bold text-white uppercase tracking-wider"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'INGRESAR'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
