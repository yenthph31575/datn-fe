import { validationMessages } from '@/libs/validation.utility';
import { z } from 'zod';

export const authSchema = z.object({
  email: z.string({ required_error: 'Email là bắt buộc' }).email().nonempty(validationMessages.required('Email')),
  password: z
    .string({ required_error: 'Password là bắt buộc' })
    .nonempty(validationMessages.required('Mật khẩu'))
    .min(6, {
      message: 'Email hoặc mật khẩu không chính xác!',
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message: 'Email hoặc mật khẩu không chính xác!',
    }),
});
export const signUpSchema = z.object({
  username: z.string({ required_error: 'Tên người dùng là bắt buộc' }).nonempty(validationMessages.required('Tên người dùng')),
  email: z.string({ required_error: 'Email là bắt buộc' }).email().nonempty(validationMessages.required('Email')),
  password: z
    .string({ required_error: 'Mật khẩu là bắt buộc' })
    .nonempty(validationMessages.required('Mật khẩu'))
    .min(6, {
      message: 'Email hoặc mật khẩu không chính xác!',
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message: 'Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt',
    }),
});

export type AuthSchema = z.infer<typeof authSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
