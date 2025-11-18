import { validationMessages } from '@/libs/validation.utility';
import { z } from 'zod';

export const createAccountSchema = z.object({
  avatar: z.string().min(1, validationMessages.required('Avatar')),
  username: z.string().min(1, validationMessages.required('Username')).max(50, validationMessages.max(50, 'Username')),
});

export type CreateAccountSchema = z.infer<typeof createAccountSchema>;

export const editAccountSchema = z.object({
  email: z.string().optional(),
  avatar: z.string().min(1, validationMessages.required('Avatar')),
  username: z.string().min(1, validationMessages.required('Username')).max(50, validationMessages.max(50, 'Username')),
});

export type EditAccountSchema = z.infer<typeof editAccountSchema>;

export const changePasswordSchema = z
  .object({
    password: z.string().min(1, validationMessages.required('Password')),
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

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
