import { validationMessages } from '@/libs/validation.utility';
import { z } from 'zod';

export const authSchema = z.object({
  email: z.string({ required_error: 'Email không được để trống. ' }).email().nonempty(validationMessages.required('Email')),
  password: z
    .string({ required_error: 'Mật khẩu không được để trống.' })
    .nonempty(validationMessages.required('Password'))
    .min(6, {
      message: '!',
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message: 'Email hoặc mật khẩu không đúng!',
    }),
});
export const signUpSchema = z.object({
  username: z.string({ required_error: 'Tên đăng nhập không được để trống.' }).nonempty(validationMessages.required('Username')),
  email: z.string({ required_error: 'Email không được để trống.' }).email().nonempty(validationMessages.required('Email')),
  password: z
    .string({ required_error: 'Mật khẩu không được để trống.' })
    .nonempty(validationMessages.required('Password'))
    .min(6, {
      message: 'Email hoặc mật khẩu không đúng!',
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message: 'Tên đăng nhập hoặc mật khẩu không đúng!',
    }),
});

export type AuthSchema = z.infer<typeof authSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
