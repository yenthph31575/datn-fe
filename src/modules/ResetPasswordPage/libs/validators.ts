import { validationMessages } from '@/libs/validation.utility';
import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
        message: 'Password must include uppercase, lowercase, number and special character',
      }),
    confirmPassword: z.string().min(1, validationMessages.required('Confirm Password')),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
