import { validationMessages } from '@/libs/validation.utility';
import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email không được bỏ trống' })
    .email('vui lòng nhập địa chỉ email hợp lệ.')
    .nonempty(validationMessages.required('Email')),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
