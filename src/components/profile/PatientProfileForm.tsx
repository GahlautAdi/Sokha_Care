import { useEffect, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { FormSection } from '@/components/forms/FormSection';
import { RHFInput } from '@/components/forms/RHFInput';
import { RHFSelect } from '@/components/forms/RHFSelect';
import { RHFTextarea } from '@/components/forms/RHFTextarea';
import { Button } from '@/components/ui/Button';
import { GENDER_OPTIONS, BLOOD_GROUP_OPTIONS } from '@/constants/profile';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { updatePatientProfile } from '@/services/profile/profileApi';
import { patientProfileSchema, type PatientProfileFormValues } from '@/services/profile/profileSchemas';
import type { PatientProfile } from '@/types/profile';
import { toApiError } from '@/utils/apiError';
import { applyFieldErrors } from '@/utils/formErrors';
import { zodResolver } from '@hookform/resolvers/zod';

import { ProfileFormCard } from './ProfileFormCard';

type PatientProfileFormProps = {
  profile: PatientProfile | null;
};

const emptyValues: PatientProfileFormValues = {
  dateOfBirth: '',
  gender: 'PREFER_NOT_TO_SAY',
  phoneNumber: '',
  bloodGroup: 'UNKNOWN',
  address: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  allergySummary: '',
};

function getDefaults(profile: PatientProfile | null): PatientProfileFormValues {
  if (!profile) {
    return emptyValues;
  }

  return {
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    phoneNumber: profile.phoneNumber,
    bloodGroup: profile.bloodGroup,
    address: profile.address,
    emergencyContactName: profile.emergencyContactName,
    emergencyContactPhone: profile.emergencyContactPhone,
    allergySummary: profile.allergySummary,
  };
}

export function PatientProfileForm({ profile }: PatientProfileFormProps) {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<PatientProfileFormValues>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: getDefaults(profile),
    mode: 'onTouched',
  });

  const mutation = useMutation({
    mutationFn: updatePatientProfile,
    onSuccess: async () => {
      setFormError(null);
      setSuccessMessage('Your patient profile has been saved.');
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.me });
    },
  });

  useEffect(() => {
    form.reset(getDefaults(profile));
    setSuccessMessage(null);
    setFormError(null);
  }, [form, profile]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSuccessMessage(null);
    setFormError(null);

    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      const normalized = toApiError(error);
      if (normalized.kind === 'validation') {
        applyFieldErrors(form.setError, normalized.fieldErrors);
      } else {
        setFormError(normalized.message);
      }
    }
  });

  return (
    <ProfileFormCard
      title="Patient Profile"
      description="Keep your personal and emergency details current so care teams can reach you quickly."
      successMessage={successMessage}
      errorMessage={formError}
      status={<span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Editable by patient role</span>}
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <FormSection title="Core details" description="These fields are required for patient profile management.">
          <div className="grid gap-4 md:grid-cols-2">
            <RHFInput<PatientProfileFormValues>
              name="dateOfBirth"
              control={form.control}
              type="date"
              label="Date of birth"
              required
            />
            <RHFSelect<PatientProfileFormValues>
              name="gender"
              control={form.control}
              label="Gender"
              required
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </RHFSelect>
            <RHFInput<PatientProfileFormValues>
              name="phoneNumber"
              control={form.control}
              label="Phone number"
              placeholder="+91XXXXXXXXXX"
              required
            />
            <RHFSelect<PatientProfileFormValues>
              name="bloodGroup"
              control={form.control}
              label="Blood group"
              required
            >
              {BLOOD_GROUP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </RHFSelect>
          </div>
        </FormSection>

        <FormSection title="Emergency and medical info" description="This information helps the care team respond safely.">
          <RHFInput<PatientProfileFormValues>
            name="address"
            control={form.control}
            label="Address"
            placeholder="Street, city, district"
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <RHFInput<PatientProfileFormValues>
              name="emergencyContactName"
              control={form.control}
              label="Emergency contact name"
              required
            />
            <RHFInput<PatientProfileFormValues>
              name="emergencyContactPhone"
              control={form.control}
              label="Emergency contact phone"
              placeholder="+91XXXXXXXXXX"
              required
            />
          </div>
          <RHFTextarea<PatientProfileFormValues>
            name="allergySummary"
            control={form.control}
            label="Allergy summary"
            placeholder="List known allergies, reactions, or write 'None known'."
            required
          />
        </FormSection>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-medium text-slate-800">Owned by the signed-in account</p>
            <p className="mt-1">The server uses your JWT context, so no manual user selection is needed.</p>
          </div>
          <Button type="submit" loading={mutation.isPending} disabled={!form.formState.isDirty && !!profile} className="sm:min-w-44">
            {profile ? 'Update patient profile' : 'Create patient profile'}
          </Button>
        </div>
      </form>
    </ProfileFormCard>
  );
}
