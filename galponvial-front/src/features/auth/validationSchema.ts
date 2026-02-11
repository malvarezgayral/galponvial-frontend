import * as yup from 'yup';

const PASSWORD_REGEX = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(PASSWORD_REGEX, {
      message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número o símbolo',
    }),
});

export type LoginFormValues = yup.InferType<typeof loginValidationSchema>;
