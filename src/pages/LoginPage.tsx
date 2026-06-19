import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { FormSection } from '@/components/forms/FormSection';
import { FormNotice } from '@/components/forms/FormNotice';
import { RHFInput } from '@/components/forms/RHFInput';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { login } from '@/services/auth/authApi';
import { loginSchema, type LoginFormValues } from '@/services/auth/authSchemas';
import { useAuthStore } from '@/store/authStore';
import type { ApiError } from '@/types/api';
import type { AuthSession } from '@/types/auth';
import { applyFieldErrors } from '@/utils/formErrors';

type AuthLocationState = {
  from?: {
    pathname: string;
    search?: string;
    hash?: string;
  };
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation<AuthSession, ApiError, LoginFormValues>({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session);
      const state = location.state as AuthLocationState | null;
      const nextPath = state?.from
        ? `${state.from.pathname}${state.from.search ?? ''}${state.from.hash ?? ''}`
        : ROUTES.dashboard;

      navigate(nextPath, { replace: true });
    },
    onError: (error) => {
      applyFieldErrors(setError, error.fieldErrors);
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const topLevelError =
    loginMutation.error && loginMutation.error.kind !== 'validation' ? loginMutation.error.message : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Welcome back</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Sign in to Sokha Care</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter your secure credentials to continue into the healthcare workspace.
        </p>
      </div>

      {topLevelError ? <FormNotice tone="error" message={topLevelError} /> : null}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormSection>
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
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            error={errors.password?.message}
          />
        </FormSection>

        <Button type="submit" fullWidth loading={loginMutation.isPending}>
          Sign in
        </Button>
      </form>

      <p className="text-sm text-slate-600">
        New here?{' '}
        <Link to={ROUTES.register} className="font-medium text-brand-700 hover:text-brand-800">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
