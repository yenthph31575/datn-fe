import { validationMessages } from '@/libs/validation.utility';
import { z } from 'zod';

export const authSchema = z.object({
  email: z.string({ required_error: 'Tên đăng nhập không được bỏ trống' }).email().nonempty(validationMessages.required('Username')),
  password: z
    .string({ required_error: 'Mật khẩu không được bỏ trống' })
    .nonempty(validationMessages.required('Password'))
    .min(6, {
      message: 'Mật khẩu phải có ít nhất 6 ký tự',
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message: 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
    }),
});

export type AuthSchema = z.infer<typeof authSchema>;
