import { validationMessages } from '@/libs/validation.utility';
import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
        message: 'Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt',
      }),
    confirmPassword: z.string().min(1, validationMessages.required('Xác nhận mật khẩu')),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
