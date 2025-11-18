import { validationMessages } from '@/libs/validation.utility';
import { z } from 'zod';

export const authSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email().nonempty(validationMessages.required('Email')),
  password: z
    .string({ required_error: 'Password is required' })
    .nonempty(validationMessages.required('Password'))
    .min(6, {
      message: 'The username or password you entered is incorrect!',
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message: 'The username or password you entered is incorrect!',
    }),
});
export const signUpSchema = z.object({
  username: z.string({ required_error: 'Username is required' }).nonempty(validationMessages.required('Username')),
  email: z.string({ required_error: 'Email is required' }).email().nonempty(validationMessages.required('Email')),
  password: z
    .string({ required_error: 'Password is required' })
    .nonempty(validationMessages.required('Password'))
    .min(6, {
      message: 'The username or password you entered is incorrect!',
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message: 'The username or password you entered is incorrect!',
    }),
});

export type AuthSchema = z.infer<typeof authSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
