import * as yup from 'yup';

const PASSWORD_REGEX = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email es requerido')
    .email('El email debe ser valido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(PASSWORD_REGEX, {
      message: 'La contraseña es incorrecta, debe contener al menos una letra mayúscula, una letra minúscula y un número o símbolo',
    }),
});

export type LoginFormValues = yup.InferType<typeof loginValidationSchema>;
