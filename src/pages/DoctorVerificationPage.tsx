import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { PageHeader } from '@/components/common/PageHeader';
import { PageShell } from '@/components/common/PageShell';
import { FormNotice } from '@/components/forms/FormNotice';
import { RHFInput } from '@/components/forms/RHFInput';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { ROUTES } from '@/constants/routes';
import { fetchDoctorVerificationStatus, submitDoctorVerification } from '@/services/doctorVerification/doctorVerificationApi';
import {
  doctorVerificationSubmitSchema,
  type DoctorVerificationSubmitFormValues,
} from '@/services/doctorVerification/doctorVerificationSchemas';
import { toApiError } from '@/utils/apiError';

const emptyValues: DoctorVerificationSubmitFormValues = {
  licenseNumber: '',
  medicalCouncil: '',
  documentUrl: '',
};

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Not reviewed yet';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatStatusLabel(status: string) {
  return status
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function statusTone(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'text-emerald-700 bg-emerald-50';
    case 'REJECTED':
      return 'text-rose-700 bg-rose-50';
    case 'UNDER_REVIEW':
      return 'text-amber-700 bg-amber-50';
    default:
      return 'text-slate-700 bg-slate-100';
  }
}

function DoctorVerificationPage() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<DoctorVerificationSubmitFormValues>({
    resolver: zodResolver(doctorVerificationSubmitSchema),
    defaultValues: emptyValues,
    mode: 'onTouched',
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.doctorVerification.status,
    queryFn: fetchDoctorVerificationStatus,
  });

  const mutation = useMutation({
    mutationFn: submitDoctorVerification,
    onSuccess: async () => {
      setFormError(null);
      setSuccessMessage('Verification request submitted successfully.');
      form.reset(emptyValues);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.doctorVerification.status });
    },
  });

  useEffect(() => {
    form.reset(emptyValues);
    setFormError(null);
  }, [form, data?.doctorId]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSuccessMessage(null);
    setFormError(null);

    if (data && !data.canSubmit) {
      setFormError('Your current verification request cannot be resubmitted yet.');
      return;
    }

    try {
      await mutation.mutateAsync(values);
    } catch (caughtError) {
      const normalized = toApiError(caughtError);
      setFormError(normalized.message);
    }
  });

  if (isLoading) {
    return (
      <PageShell>
        <Loader fullscreen label="Loading verification status..." />
      </PageShell>
    );
  }

  if (isError) {
    const normalized = toApiError(error);
    const action =
      normalized.status === 404 ? (
        <Button to={ROUTES.profile} variant="secondary">
          Complete doctor profile
        </Button>
      ) : (
        <Button onClick={() => refetch()} variant="secondary">
          Try again
        </Button>
      );

    return (
      <PageShell>
        <div className="space-y-6">
          <PageHeader
            eyebrow="Doctor access"
            title="Doctor Verification"
            description="Submit your medical credentials before appointment booking becomes available."
          />
          <EmptyState
            title={normalized.status === 404 ? 'Doctor profile required' : 'Verification status unavailable'}
            description={
              normalized.status === 404
                ? 'Please complete your doctor profile first. Verification can only be submitted after a doctor profile exists.'
                : normalized.message
            }
            action={action}
          />
        </div>
      </PageShell>
    );
  }

  const verification = data?.latestVerification ?? null;
  const canSubmit = data?.canSubmit ?? false;
  const statusLabel = verification ? formatStatusLabel(verification.status) : 'Not submitted';

  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Doctor access"
          title="Doctor Verification"
          description="Upload your license details so the Sokha Care team can review and approve your doctor profile."
        />

        {successMessage ? <FormNotice tone="success" title="Success" message={successMessage} /> : null}
        {formError ? <FormNotice tone="error" title="Unable to submit" message={formError} /> : null}

        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Current verification status</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                  {verification ? statusLabel : 'No request submitted yet'}
                </h2>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone(verification?.status ?? 'PENDING')}`}>
                {verification ? statusLabel : 'Ready to submit'}
              </span>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-2">
            <div className="space-y-4">
              {verification ? (
                <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-slate-500">Submitted at</span>
                    <span className="font-semibold text-slate-900">{formatTimestamp(verification.submittedAt)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-slate-500">Reviewed at</span>
                    <span className="font-semibold text-slate-900">{formatTimestamp(verification.reviewedAt)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-slate-500">License number</span>
                    <span className="font-semibold text-slate-900">{verification.licenseNumber}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-slate-500">Medical council</span>
                    <span className="font-semibold text-slate-900">{verification.medicalCouncil}</span>
                  </div>
                  <div className="break-all">
                    <p className="font-medium text-slate-500">Document URL</p>
                    <a className="mt-1 block font-semibold text-brand-700 hover:underline" href={verification.documentUrl} target="_blank" rel="noreferrer noopener">
                      {verification.documentUrl}
                    </a>
                  </div>
                  {verification.remarks ? (
                    <div>
                      <p className="font-medium text-slate-500">Remarks</p>
                      <p className="mt-1 leading-6 text-slate-700">{verification.remarks}</p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <EmptyState
                  title="Ready for review"
                  description="Submit your medical license details and document URL to start the approval process."
                />
              )}

              {!canSubmit ? (
                <FormNotice
                  tone="info"
                  title="Submission paused"
                  message={
                    verification?.status === 'APPROVED'
                      ? 'This doctor verification has already been approved.'
                      : 'You already have an active verification request under review.'
                  }
                />
              ) : verification?.status === 'REJECTED' ? (
                <FormNotice tone="info" title="Resubmission allowed" message="Your last request was rejected, so you can submit a revised one now." />
              ) : null}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Submission form</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">Verification details</h3>
              </div>

              <form className="space-y-4" onSubmit={onSubmit}>
                <fieldset disabled={mutation.isPending || !canSubmit} className="space-y-4">
                  <RHFInput<DoctorVerificationSubmitFormValues>
                    name="licenseNumber"
                    control={form.control}
                    label="License number"
                    placeholder="MD-123456"
                    required
                  />
                  <RHFInput<DoctorVerificationSubmitFormValues>
                    name="medicalCouncil"
                    control={form.control}
                    label="Medical council"
                    placeholder="Bangladesh Medical & Dental Council"
                    required
                  />
                  <RHFInput<DoctorVerificationSubmitFormValues>
                    name="documentUrl"
                    control={form.control}
                    label="Document URL"
                    placeholder="https://..."
                    hint="Store a public or pre-signed URL for the verification document."
                    required
                  />
                </fieldset>

                <div className="flex items-center justify-end">
                  <Button type="submit" loading={mutation.isPending} disabled={!canSubmit} className="sm:min-w-48">
                    {verification?.status === 'REJECTED' ? 'Resubmit verification' : 'Submit verification'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

export default DoctorVerificationPage;
