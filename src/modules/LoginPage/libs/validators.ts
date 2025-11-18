import { validationMessages } from '@/libs/validation.utility';
import { z } from 'zod';

export const authSchema = z.object({
  email: z.string({ required_error: 'Username is required' }).email().nonempty(validationMessages.required('Username')),
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
