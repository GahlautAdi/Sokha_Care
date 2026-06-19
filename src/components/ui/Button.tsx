import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { Link, type To } from 'react-router-dom';

import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonBaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
};

type ButtonStyleProps = {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth?: boolean;
  className?: string | undefined;
};

type ButtonAsButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps | 'href'> & { to?: never };
type ButtonAsLinkProps = ButtonBaseProps & {
  to: To;
  target?: string;
  rel?: string;
  onClick?: never;
};

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white shadow-soft hover:bg-brand-700',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

function sharedClasses({ variant = 'primary', size = 'md', fullWidth, className }: ButtonStyleProps) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );
}

function isLinkButton(props: ButtonProps): props is ButtonAsLinkProps {
  return 'to' in props;
}

export function Button(props: ButtonProps) {
  const { leftIcon, rightIcon, loading, children } = props;
  const variant = props.variant ?? 'primary';
  const size = props.size ?? 'md';
  const fullWidth = props.fullWidth ?? false;
  const className = props.className;
  const styleProps: ButtonStyleProps = { variant, size, fullWidth, className };
  const content = (
    <>
      {loading ? (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {rightIcon && !loading ? rightIcon : null}
    </>
  );

  if (isLinkButton(props)) {
    const { to, target, rel } = props;
    const nextRel = target === '_blank' ? rel ?? 'noreferrer noopener' : rel;
    return (
      <Link
        to={to}
        target={target}
        rel={nextRel}
        className={cn(sharedClasses(styleProps), loading && 'pointer-events-none')}
        aria-disabled={loading}
        tabIndex={loading ? -1 : undefined}
      >
        {content}
      </Link>
    );
  }

  const {
    to,
    variant: nativeVariant,
    size: nativeSize,
    fullWidth: nativeFullWidth,
    className: nativeClassName,
    loading: nativeLoading,
    leftIcon: nativeLeftIcon,
    rightIcon: nativeRightIcon,
    children: nativeChildren,
    ...buttonProps
  } = props;

  void [to, nativeVariant, nativeSize, nativeFullWidth, nativeClassName, nativeLoading, nativeLeftIcon, nativeRightIcon, nativeChildren];

  return (
    <button
      {...buttonProps}
      type={buttonProps.type ?? 'button'}
      className={sharedClasses(styleProps)}
      disabled={buttonProps.disabled || loading}
    >
      {content}
    </button>
  );
}
