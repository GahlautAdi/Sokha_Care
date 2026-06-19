import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters');

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
    lastName: z.string().trim().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
