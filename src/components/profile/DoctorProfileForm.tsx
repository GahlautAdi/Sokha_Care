import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { FormSection } from '@/components/forms/FormSection';
import { RHFInput } from '@/components/forms/RHFInput';
import { RHFSelect } from '@/components/forms/RHFSelect';
import { RHFTextarea } from '@/components/forms/RHFTextarea';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { CONSULTATION_MODE_OPTIONS } from '@/constants/profile';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { updateDoctorProfile } from '@/services/profile/profileApi';
import { doctorProfileSchema, type DoctorProfileFormValues } from '@/services/profile/profileSchemas';
import type { DoctorProfile } from '@/types/profile';
import { toApiError } from '@/utils/apiError';
import { applyFieldErrors } from '@/utils/formErrors';

import { ProfileFormCard } from './ProfileFormCard';

type DoctorProfileFormProps = {
  profile: DoctorProfile | null;
};

const emptyValues: DoctorProfileFormValues = {
  specialty: '',
  consultationFee: '',
  bio: '',
  consultationMode: 'IN_PERSON',
  profilePhotoUrl: '',
  active: true,
};

function getDefaults(profile: DoctorProfile | null): DoctorProfileFormValues {
  if (!profile) {
    return emptyValues;
  }

  return {
    specialty: profile.specialty,
    consultationFee: profile.consultationFee.toString(),
    bio: profile.bio,
    consultationMode: profile.consultationMode,
    profilePhotoUrl: profile.profilePhotoUrl ?? '',
    active: profile.active,
  };
}

export function DoctorProfileForm({ profile }: DoctorProfileFormProps) {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<DoctorProfileFormValues>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: getDefaults(profile),
    mode: 'onTouched',
  });

  const mutation = useMutation({
    mutationFn: updateDoctorProfile,
    onSuccess: async () => {
      setFormError(null);
      setSuccessMessage('Your doctor profile has been saved.');
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
      title="Doctor Profile"
      description="Keep your clinical profile up to date so patients and future workflows can rely on it."
      successMessage={successMessage}
      errorMessage={formError}
      status={<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Editable by doctor role</span>}
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <FormSection title="Clinical details" description="These fields describe your specialty and consultation setup.">
          <RHFInput<DoctorProfileFormValues>
            name="specialty"
            control={form.control}
            label="Specialty"
            placeholder="Internal Medicine, Pediatrics, Dermatology..."
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <RHFInput<DoctorProfileFormValues>
              name="consultationFee"
              control={form.control}
              label="Consultation fee"
              type="number"
              min="0"
              step="0.01"
              required
            />
            <RHFSelect<DoctorProfileFormValues>
              name="consultationMode"
              control={form.control}
              label="Consultation mode"
              required
            >
              {CONSULTATION_MODE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </RHFSelect>
          </div>
        </FormSection>

        <FormSection title="Public information" description="This content can be shown in profile views later on.">
          <RHFTextarea<DoctorProfileFormValues>
            name="bio"
            control={form.control}
            label="Bio"
            placeholder="Summarize your experience, approach, and areas of focus."
            required
          />
          <RHFInput<DoctorProfileFormValues>
            name="profilePhotoUrl"
            control={form.control}
            label="Profile photo URL"
            placeholder="https://..."
            hint="Leave blank if you do not have a photo yet."
          />
        </FormSection>

        <Checkbox
          {...form.register('active')}
          label="Profile is active"
          hint="Inactive profiles can be hidden from future listing workflows."
        />

        <div className="flex items-center justify-end">
          <Button type="submit" loading={mutation.isPending} disabled={!form.formState.isDirty && !!profile} className="sm:min-w-44">
            {profile ? 'Update doctor profile' : 'Create doctor profile'}
          </Button>
        </div>
      </form>
    </ProfileFormCard>
  );
}
