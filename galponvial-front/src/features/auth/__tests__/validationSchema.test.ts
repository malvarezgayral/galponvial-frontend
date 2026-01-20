import { loginValidationSchema } from '../validationSchema';
import * as yup from 'yup';

describe('loginValidationSchema', () => {
  it('should validate correct credentials', async () => {
    const validData = {
      email: 'milagrosalvarez2604@gmail.com',
      password: 'TestPassword123',
    };

    const result = await loginValidationSchema.validate(validData);
    expect(result).toEqual(validData);
  });

  it('should reject empty email', async () => {
    const invalidData = {
      email: '',
      password: 'TestPassword123',
    };

    await expect(loginValidationSchema.validate(invalidData)).rejects.toThrow();
  });

  it('should reject invalid email format', async () => {
    const invalidData = {
      email: 'notanemail',
      password: 'TestPassword123',
    };

    await expect(loginValidationSchema.validate(invalidData)).rejects.toThrow(
      /valid email/i
    );
  });

  it('should reject missing password', async () => {
    const invalidData = {
      email: 'milagrosalvarez2604@gmail.com',
      password: '',
    };

    await expect(loginValidationSchema.validate(invalidData)).rejects.toThrow();
  });

  it('should reject password without uppercase letter', async () => {
    const invalidData = {
      email: 'milagrosalvarez2604@gmail.com',
      password: 'testpassword123',
    };

    await expect(loginValidationSchema.validate(invalidData)).rejects.toThrow(
      /Uppercase letter/
    );
  });

  it('should reject password without lowercase letter', async () => {
    const invalidData = {
      email: 'milagrosalvarez2604@gmail.com',
      password: 'TESTPASSWORD123',
    };

    await expect(loginValidationSchema.validate(invalidData)).rejects.toThrow(
      /lowercase letter/
    );
  });

  it('should reject password without number', async () => {
    const invalidData = {
      email: 'milagrosalvarez2604@gmail.com',
      password: 'TestPasswordAbc',
    };

    await expect(loginValidationSchema.validate(invalidData)).rejects.toThrow(
      /number/
    );
  });

  it('should reject password shorter than 8 characters', async () => {
    const invalidData = {
      email: 'milagrosalvarez2604@gmail.com',
      password: 'Test123',
    };

    await expect(loginValidationSchema.validate(invalidData)).rejects.toThrow(
      /8 characters/
    );
  });
});
