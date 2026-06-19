import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { FormSection } from '@/components/forms/FormSection';
import { FormNotice } from '@/components/forms/FormNotice';
import { RHFInput } from '@/components/forms/RHFInput';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { register as registerAccount } from '@/services/auth/authApi';
import { registerSchema, type RegisterFormValues } from '@/services/auth/authSchemas';
import { useAuthStore } from '@/store/authStore';
import type { ApiError } from '@/types/api';
import type { AuthSession } from '@/types/auth';
import { applyFieldErrors } from '@/utils/formErrors';

function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const redirectTimerRef = useRef<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useMutation<AuthSession, ApiError, RegisterFormValues>({
    mutationFn: ({ confirmPassword: _confirmPassword, ...payload }) => registerAccount(payload),
    onSuccess: (session) => {
      setSession(session);
      setSuccessMessage('Account created successfully. Redirecting to your workspace...');
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
      redirectTimerRef.current = window.setTimeout(() => {
        navigate(ROUTES.dashboard, { replace: true });
      }, 700);
    },
    onError: (error) => {
      setSuccessMessage(null);
      applyFieldErrors(setError, error.fieldErrors);
    },
  });

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const onSubmit = (values: RegisterFormValues) => {
    setSuccessMessage(null);
    registerMutation.mutate(values);
  };

  const topLevelError =
    registerMutation.error && registerMutation.error.kind !== 'validation' ? registerMutation.error.message : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Create account</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Register for Sokha Care</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Create your secure healthcare workspace account with the backend auth service.
        </p>
      </div>

      {topLevelError ? <FormNotice tone="error" message={topLevelError} /> : null}
      {successMessage ? <FormNotice tone="success" message={successMessage} /> : null}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormSection>
          <div className="grid gap-4 sm:grid-cols-2">
            <RHFInput
              name="firstName"
              control={control}
              label="First name"
              placeholder="Your first name"
              autoComplete="given-name"
              required
              error={errors.firstName?.message}
            />
            <RHFInput
              name="lastName"
              control={control}
              label="Last name"
              placeholder="Your last name"
              autoComplete="family-name"
              required
              error={errors.lastName?.message}
            />
          </div>
          <RHFInput
            name="email"
            control={control}
            label="Email"
            type="email"
            placeholder="you@hospital.com"
            autoComplete="email"
            required
            error={errors.email?.message}
          />
          <RHFInput
            name="password"
            control={control}
            label="Password"
            type="password"
            placeholder="Choose a secure password"
            autoComplete="new-password"
            required
            error={errors.password?.message}
          />
          <RHFInput
            name="confirmPassword"
            control={control}
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            autoComplete="new-password"
            required
            error={errors.confirmPassword?.message}
          />
        </FormSection>

        <Button type="submit" fullWidth loading={registerMutation.isPending}>
          Create account
        </Button>
      </form>

      <p className="text-sm text-slate-600">
        Already have an account?{' '}
        <Link to={ROUTES.login} className="font-medium text-brand-700 hover:text-brand-800">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
