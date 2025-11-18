import { validationMessages } from '@/libs/validation.utility';
import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .nonempty(validationMessages.required('Email')),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
