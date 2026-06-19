import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { PageHeader } from '@/components/common/PageHeader';
import { PageShell } from '@/components/common/PageShell';
import { FormNotice } from '@/components/forms/FormNotice';
import { RHFTextarea } from '@/components/forms/RHFTextarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { approveDoctorVerification, fetchDoctorVerificationRequest, fetchDoctorVerificationRequests, rejectDoctorVerification } from '@/services/doctorVerification/doctorVerificationApi';
import {
  doctorVerificationReviewSchema,
  type DoctorVerificationReviewFormValues,
} from '@/services/doctorVerification/doctorVerificationSchemas';
import type { DoctorVerification } from '@/types/doctorVerification';
import { toApiError } from '@/utils/apiError';

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Not available';
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

function RequestListItem({
  request,
  active,
  onSelect,
}: {
  request: DoctorVerification;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(request.id)}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        active ? 'border-brand-300 bg-brand-50 shadow-soft' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{request.licenseNumber}</p>
          <p className="mt-1 text-xs text-slate-500">{request.medicalCouncil}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusTone(request.status)}`}>
          {formatStatusLabel(request.status)}
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">Submitted {formatTimestamp(request.submittedAt)}</p>
    </button>
  );
}

function AdminDoctorVerificationPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<DoctorVerificationReviewFormValues>({
    resolver: zodResolver(doctorVerificationReviewSchema),
    defaultValues: {
      remarks: '',
    },
    mode: 'onTouched',
  });

  const listQuery = useQuery({
    queryKey: QUERY_KEYS.doctorVerification.requests,
    queryFn: fetchDoctorVerificationRequests,
  });

  const detailQuery = useQuery({
    queryKey: selectedId ? QUERY_KEYS.doctorVerification.request(selectedId) : QUERY_KEYS.doctorVerification.request('pending'),
    queryFn: () => fetchDoctorVerificationRequest(selectedId ?? ''),
    enabled: Boolean(selectedId),
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedId) {
        throw new Error('Select a request first');
      }

      const remarks = String(form.getValues('remarks') ?? '').trim();
      return approveDoctorVerification(selectedId, remarks ? { remarks } : undefined);
    },
    onSuccess: async () => {
      setFormError(null);
      setSuccessMessage('Verification request approved successfully.');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.doctorVerification.requests }),
        queryClient.invalidateQueries({
          queryKey: selectedId ? QUERY_KEYS.doctorVerification.request(selectedId) : QUERY_KEYS.doctorVerification.requests,
        }),
      ]);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      if (!selectedId) {
        throw new Error('Select a request first');
      }

      const remarks = String(form.getValues('remarks') ?? '').trim();
      if (!remarks) {
        form.setError('remarks', { type: 'manual', message: 'Remarks are required when rejecting a request.' });
        throw new Error('Remarks are required');
      }

      return rejectDoctorVerification(selectedId, { remarks });
    },
    onSuccess: async () => {
      setFormError(null);
      setSuccessMessage('Verification request rejected successfully.');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.doctorVerification.requests }),
        queryClient.invalidateQueries({
          queryKey: selectedId ? QUERY_KEYS.doctorVerification.request(selectedId) : QUERY_KEYS.doctorVerification.requests,
        }),
      ]);
    },
  });

  useEffect(() => {
    const firstRequest = listQuery.data?.[0];
    if (!selectedId && firstRequest) {
      setSelectedId(firstRequest.id);
    }
  }, [listQuery.data, selectedId]);

  useEffect(() => {
    form.reset({ remarks: detailQuery.data?.remarks ?? '' });
    setSuccessMessage(null);
    setFormError(null);
  }, [selectedId, form]);

  const requests = listQuery.data ?? [];
  const selectedRequest = detailQuery.data ?? null;
  const isBusy = approveMutation.isPending || rejectMutation.isPending;

  const handleApprove = async () => {
    setSuccessMessage(null);
    setFormError(null);

    try {
      await approveMutation.mutateAsync();
    } catch (caughtError) {
      const normalized = toApiError(caughtError);
      setFormError(normalized.message);
    }
  };

  const handleReject = async () => {
    setSuccessMessage(null);
    setFormError(null);

    try {
      await rejectMutation.mutateAsync();
    } catch (caughtError) {
      const normalized = toApiError(caughtError);
      if (normalized.message !== 'Remarks are required') {
        setFormError(normalized.message);
      }
    }
  };

  if (listQuery.isLoading) {
    return (
      <PageShell>
        <Loader fullscreen label="Loading verification requests..." />
      </PageShell>
    );
  }

  if (listQuery.isError) {
    const normalized = toApiError(listQuery.error);
    return (
      <PageShell>
        <div className="space-y-6">
          <PageHeader
            eyebrow="Admin"
            title="Doctor Verification Review"
            description="Review submitted doctor credentials and decide whether they can move forward."
          />
          <EmptyState
            title="Verification queue unavailable"
            description={normalized.message}
            action={
              <Button onClick={() => listQuery.refetch()} variant="secondary">
                Try again
              </Button>
            }
          />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Admin"
          title="Doctor Verification Review"
          description="Review doctor submissions, inspect their details, and approve or reject them from one screen."
        />

        {successMessage ? <FormNotice tone="success" title="Success" message={successMessage} /> : null}
        {formError ? <FormNotice tone="error" title="Action failed" message={formError} /> : null}

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <Card className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Requests</p>
                <h2 className="text-lg font-semibold text-slate-900">{requests.length} items</h2>
              </div>
            </div>

            {requests.length === 0 ? (
              <EmptyState
                title="No requests yet"
                description="Doctor verification submissions will appear here when doctors start sending their credentials."
              />
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <RequestListItem key={request.id} request={request} active={request.id === selectedId} onSelect={setSelectedId} />
                ))}
              </div>
            )}
          </Card>

          <Card className="overflow-hidden">
            {detailQuery.isLoading ? (
              <Loader fullscreen label="Loading request details..." />
            ) : detailQuery.isError ? (
              <div className="p-6">
                <EmptyState
                  title="Request details unavailable"
                  description={toApiError(detailQuery.error).message}
                  action={
                    <Button onClick={() => detailQuery.refetch()} variant="secondary">
                      Try again
                    </Button>
                  }
                />
              </div>
            ) : selectedRequest ? (
              <div className="space-y-6 p-6">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Verification request</p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900">{selectedRequest.licenseNumber}</h2>
                    <p className="mt-1 text-sm text-slate-500">{selectedRequest.medicalCouncil}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone(selectedRequest.status)}`}>
                    {formatStatusLabel(selectedRequest.status)}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Doctor ID</p>
                    <p className="mt-2 break-all text-sm font-medium text-slate-900">{selectedRequest.doctorId}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Submitted at</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{formatTimestamp(selectedRequest.submittedAt)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reviewed at</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{formatTimestamp(selectedRequest.reviewedAt)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reviewed by</p>
                    <p className="mt-2 break-all text-sm font-medium text-slate-900">{selectedRequest.reviewedBy ?? 'Not reviewed yet'}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-500">Document URL</p>
                  <a className="mt-2 block break-all text-sm font-semibold text-brand-700 hover:underline" href={selectedRequest.documentUrl} target="_blank" rel="noreferrer noopener">
                    {selectedRequest.documentUrl}
                  </a>
                </div>

                {selectedRequest.remarks ? (
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-500">Remarks</p>
                    <p className="mt-2 leading-6 text-slate-700">{selectedRequest.remarks}</p>
                  </div>
                ) : null}

                <form className="space-y-4 rounded-2xl border border-slate-200 p-4" onSubmit={(event) => event.preventDefault()}>
                  <RHFTextarea<DoctorVerificationReviewFormValues>
                    name="remarks"
                    control={form.control}
                    label="Review remarks"
                    placeholder="Add approval notes or the reason for rejection..."
                    hint="Optional for approval. Required for rejection."
                  />

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button variant="secondary" onClick={() => form.reset({ remarks: selectedRequest.remarks ?? '' })} disabled={isBusy}>
                      Reset notes
                    </Button>
                    <Button variant="danger" loading={rejectMutation.isPending} disabled={isBusy} onClick={handleReject}>
                      Reject
                    </Button>
                    <Button loading={approveMutation.isPending} disabled={isBusy} onClick={handleApprove}>
                      Approve
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-6">
                <EmptyState
                  title="Select a request"
                  description="Choose a verification request from the list to inspect the document and decide its outcome."
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

export default AdminDoctorVerificationPage;
