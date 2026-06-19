import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { PageHeader } from '@/components/common/PageHeader';
import { PageShell } from '@/components/common/PageShell';
import { FormNotice } from '@/components/forms/FormNotice';
import { RHFInput } from '@/components/forms/RHFInput';
import { RHFSelect } from '@/components/forms/RHFSelect';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { ROUTES } from '@/constants/routes';
import { fetchDoctorVerificationStatus } from '@/services/doctorVerification/doctorVerificationApi';
import {
  createDoctorAvailability,
  deleteDoctorAvailability,
  fetchMyDoctorAvailability,
  updateDoctorAvailability,
} from '@/services/doctorAvailability/doctorAvailabilityApi';
import {
  doctorAvailabilitySchema,
  type DoctorAvailabilityFormValues,
} from '@/services/doctorAvailability/doctorAvailabilitySchemas';
import type { DoctorAvailability } from '@/types/doctorAvailability';
import { toApiError } from '@/utils/apiError';

const emptyValues: DoctorAvailabilityFormValues = {
  dayOfWeek: 'MONDAY',
  startTime: '09:00',
  endTime: '17:00',
  consultationMode: 'BOTH',
};

const dayLabels: Record<DoctorAvailability['dayOfWeek'], string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
};

const consultationModeLabels: Record<DoctorAvailability['consultationMode'], string> = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  BOTH: 'Both',
};

const dayOptions: DoctorAvailability['dayOfWeek'][] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const consultationModeOptions: DoctorAvailability['consultationMode'][] = ['ONLINE', 'OFFLINE', 'BOTH'];

function formatTimeLabel(value: string) {
  const normalized = value.length === 5 ? `${value}:00` : value;
  const date = new Date(`1970-01-01T${normalized}`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatAuditTime(value: string | null) {
  if (!value) {
    return 'Not updated yet';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function availabilityTone(active: boolean) {
  return active ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100';
}

function modeTone(mode: DoctorAvailability['consultationMode']) {
  switch (mode) {
    case 'ONLINE':
      return 'text-brand-700 bg-brand-50';
    case 'OFFLINE':
      return 'text-amber-700 bg-amber-50';
    case 'BOTH':
      return 'text-slate-700 bg-slate-100';
    default:
      return 'text-slate-700 bg-slate-100';
  }
}

function toFormValues(availability: DoctorAvailability): DoctorAvailabilityFormValues {
  return {
    dayOfWeek: availability.dayOfWeek,
    startTime: availability.startTime.slice(0, 5),
    endTime: availability.endTime.slice(0, 5),
    consultationMode: availability.consultationMode,
  };
}

function compareAvailability(a: DoctorAvailability, b: DoctorAvailability) {
  const dayCompare = dayOptions.indexOf(a.dayOfWeek) - dayOptions.indexOf(b.dayOfWeek);
  if (dayCompare !== 0) {
    return dayCompare;
  }

  return a.startTime.localeCompare(b.startTime);
}

function DoctorAvailabilityPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<DoctorAvailabilityFormValues>({
    resolver: zodResolver(doctorAvailabilitySchema),
    defaultValues: emptyValues,
    mode: 'onTouched',
  });

  const verificationQuery = useQuery({
    queryKey: QUERY_KEYS.doctorVerification.status,
    queryFn: fetchDoctorVerificationStatus,
  });

  const availabilityQuery = useQuery({
    queryKey: QUERY_KEYS.doctorAvailability.me,
    queryFn: fetchMyDoctorAvailability,
    enabled: verificationQuery.isSuccess,
  });

  const sortedAvailability = useMemo(() => {
    return [...(availabilityQuery.data ?? [])].sort(compareAvailability);
  }, [availabilityQuery.data]);

  const editingAvailability = selectedId
    ? sortedAvailability.find((availability) => availability.id === selectedId) ?? null
    : null;

  const canManage = verificationQuery.data?.latestVerification?.status === 'APPROVED';

  useEffect(() => {
    if (editingAvailability) {
      form.reset(toFormValues(editingAvailability));
      return;
    }

    form.reset(emptyValues);
  }, [editingAvailability, form]);

  useEffect(() => {
    setSelectedId(null);
    setSuccessMessage(null);
    setFormError(null);
  }, [verificationQuery.data?.doctorId]);

  const saveMutation = useMutation({
    mutationFn: async (values: DoctorAvailabilityFormValues) => {
      if (editingAvailability) {
        return updateDoctorAvailability(editingAvailability.id, values);
      }

      return createDoctorAvailability(values);
    },
    onSuccess: async () => {
      setFormError(null);
      setSuccessMessage(editingAvailability ? 'Availability updated successfully.' : 'Availability created successfully.');
      setSelectedId(null);
      form.reset(emptyValues);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.doctorAvailability.me });
      if (verificationQuery.data?.doctorId) {
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.doctorAvailability.doctor(verificationQuery.data.doctorId) });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDoctorAvailability,
    onSuccess: async () => {
      setFormError(null);
      setSuccessMessage('Availability removed successfully.');
      if (editingAvailability?.id) {
        setSelectedId(null);
      }
      form.reset(emptyValues);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.doctorAvailability.me });
      if (verificationQuery.data?.doctorId) {
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.doctorAvailability.doctor(verificationQuery.data.doctorId) });
      }
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSuccessMessage(null);
    setFormError(null);

    if (!canManage) {
      setFormError('Only approved doctors can manage availability.');
      return;
    }

    try {
      await saveMutation.mutateAsync(values);
    } catch (caughtError) {
      const normalized = toApiError(caughtError);
      setFormError(normalized.message);
    }
  });

  const handleEdit = (availability: DoctorAvailability) => {
    setSelectedId(availability.id);
    setSuccessMessage(null);
    setFormError(null);
  };

  const handleDelete = async (availability: DoctorAvailability) => {
    if (!window.confirm('Deactivate this availability slot?')) {
      return;
    }

    setSuccessMessage(null);
    setFormError(null);

    try {
      await deleteMutation.mutateAsync(availability.id);
    } catch (caughtError) {
      const normalized = toApiError(caughtError);
      setFormError(normalized.message);
    }
  };

  if (verificationQuery.isLoading) {
    return (
      <PageShell>
        <Loader fullscreen label="Loading availability..." />
      </PageShell>
    );
  }

  if (verificationQuery.isError) {
    const normalized = toApiError(verificationQuery.error);
    const action =
      normalized.status === 404 ? (
        <Button to={ROUTES.profile} variant="secondary">
          Complete doctor profile
        </Button>
      ) : (
        <Button onClick={() => verificationQuery.refetch()} variant="secondary">
          Try again
        </Button>
      );

    return (
      <PageShell>
        <div className="space-y-6">
          <PageHeader
            eyebrow="Doctor access"
            title="Doctor Availability"
            description="Manage weekly consultation slots for patients to view."
          />
          <EmptyState
            title={normalized.status === 404 ? 'Doctor profile required' : 'Availability status unavailable'}
            description={
              normalized.status === 404
                ? 'Please complete your doctor profile first. Availability can only be managed after a doctor profile exists.'
                : normalized.message
            }
            action={action}
          />
        </div>
      </PageShell>
    );
  }

  const availability = sortedAvailability;
  const activeCount = availability.filter((slot) => slot.active).length;
  const inactiveCount = availability.filter((slot) => !slot.active).length;

  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Doctor access"
          title="Doctor Availability"
          description="Create and manage your weekly consultation slots. Patients only see active slots."
        />

        {successMessage ? <FormNotice tone="success" title="Success" message={successMessage} /> : null}
        {formError ? <FormNotice tone="error" title="Unable to save" message={formError} /> : null}

        {!canManage ? (
          <FormNotice
            tone="info"
            title="Approval required"
            message="Your doctor verification must be approved before you can add, edit, or deactivate availability."
          />
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Weekly schedule view</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">Availability list</h2>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{activeCount} active</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{inactiveCount} inactive</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {availabilityQuery.isLoading ? (
                <Loader label="Loading your availability..." />
              ) : availabilityQuery.isError ? (
                <EmptyState
                  title="Unable to load availability"
                  description={toApiError(availabilityQuery.error).message}
                  action={
                    <Button onClick={() => availabilityQuery.refetch()} variant="secondary">
                      Retry
                    </Button>
                  }
                />
              ) : availability.length === 0 ? (
                <EmptyState
                  title="No availability added yet"
                  description="Create your first weekly slot on the right. Once saved, patients will be able to see the active schedule."
                />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left">
                      <thead className="bg-slate-50">
                        <tr className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          <th className="px-4 py-3 font-semibold">Day</th>
                          <th className="px-4 py-3 font-semibold">Start</th>
                          <th className="px-4 py-3 font-semibold">End</th>
                          <th className="px-4 py-3 font-semibold">Mode</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                          <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {availability.map((slot) => (
                          <tr key={slot.id} className="align-top">
                            <td className="px-4 py-4">
                              <div className="font-medium text-slate-900">{dayLabels[slot.dayOfWeek]}</div>
                              <div className="mt-1 text-xs text-slate-500">{formatAuditTime(slot.createdAt)}</div>
                            </td>
                            <td className="px-4 py-4 font-medium text-slate-900">{formatTimeLabel(slot.startTime)}</td>
                            <td className="px-4 py-4 font-medium text-slate-900">{formatTimeLabel(slot.endTime)}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${modeTone(slot.consultationMode)}`}>
                                {consultationModeLabels[slot.consultationMode]}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${availabilityTone(slot.active)}`}>
                                {slot.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleEdit(slot)}
                                  disabled={!slot.active || !canManage}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(slot)}
                                  disabled={!slot.active || !canManage || deleteMutation.isPending}
                                >
                                  Deactivate
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{editingAvailability ? 'Edit slot' : 'Add slot'}</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    {editingAvailability ? `${dayLabels[editingAvailability.dayOfWeek]} slot` : 'New weekly availability'}
                  </h2>
                </div>
                {editingAvailability ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedId(null);
                      setFormError(null);
                      setSuccessMessage(null);
                      form.reset(emptyValues);
                    }}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </div>

            <form className="space-y-4 p-6" onSubmit={onSubmit}>
              <fieldset disabled={saveMutation.isPending || !canManage} className="space-y-4">
                <RHFSelect<DoctorAvailabilityFormValues>
                  name="dayOfWeek"
                  control={form.control}
                  label="Day"
                  required
                >
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>
                      {dayLabels[day]}
                    </option>
                  ))}
                </RHFSelect>

                <div className="grid gap-4 sm:grid-cols-2">
                  <RHFInput<DoctorAvailabilityFormValues>
                    name="startTime"
                    control={form.control}
                    label="Start time"
                    type="time"
                    required
                  />
                  <RHFInput<DoctorAvailabilityFormValues>
                    name="endTime"
                    control={form.control}
                    label="End time"
                    type="time"
                    required
                  />
                </div>

                <RHFSelect<DoctorAvailabilityFormValues>
                  name="consultationMode"
                  control={form.control}
                  label="Consultation mode"
                  required
                >
                  {consultationModeOptions.map((mode) => (
                    <option key={mode} value={mode}>
                      {consultationModeLabels[mode]}
                    </option>
                  ))}
                </RHFSelect>
              </fieldset>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  {editingAvailability
                    ? `Created on ${formatAuditTime(editingAvailability.createdAt)}. Updates keep the slot active state unchanged.`
                    : 'Use 24-hour time to define a weekly slot.'}
                </p>
                <Button type="submit" loading={saveMutation.isPending} disabled={!canManage}>
                  {editingAvailability ? 'Update slot' : 'Save slot'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

export default DoctorAvailabilityPage;
