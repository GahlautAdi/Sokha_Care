import { useEffect, useId } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils/cn';

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export function Modal({ open, title, description, onClose, children, className }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn('w-full max-w-lg rounded-3xl bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.18)]', className)}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 space-y-1">
          <h2 id={titleId} className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="text-sm leading-6 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
