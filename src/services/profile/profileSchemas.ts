import { z } from 'zod';

const phoneRegex = /^\+?[0-9]{7,20}$/;
const urlRegex = /^$|^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

function isPastDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date < today;
}

export const patientProfileSchema = z.object({
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(isPastDate, 'Date of birth must be in the past'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  phoneNumber: z.string().min(1, 'Phone number is required').regex(phoneRegex, 'Enter a valid phone number'),
  bloodGroup: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'UNKNOWN']),
  address: z.string().trim().min(1, 'Address is required').max(500, 'Address is too long'),
  emergencyContactName: z.string().trim().min(1, 'Emergency contact name is required').max(100, 'Emergency contact name is too long'),
  emergencyContactPhone: z.string().min(1, 'Emergency contact phone is required').regex(phoneRegex, 'Enter a valid phone number'),
  allergySummary: z.string().trim().min(1, 'Allergy summary is required').max(1000, 'Allergy summary is too long'),
});

export const doctorProfileSchema = z.object({
  specialty: z.string().trim().min(1, 'Specialty is required').max(120, 'Specialty is too long'),
  consultationFee: z
    .string()
    .trim()
    .min(1, 'Consultation fee is required')
    .refine((value) => {
      const fee = Number(value);
      return Number.isFinite(fee) && fee >= 0;
    }, 'Enter a valid consultation fee'),
  bio: z.string().trim().min(1, 'Bio is required').max(2000, 'Bio is too long'),
  consultationMode: z.enum(['IN_PERSON', 'ONLINE', 'BOTH']),
  profilePhotoUrl: z.string().trim().max(500, 'Profile photo URL is too long').regex(urlRegex, 'Enter a valid URL or leave it blank'),
  active: z.boolean(),
});

export type PatientProfileFormValues = z.infer<typeof patientProfileSchema>;
export type DoctorProfileFormValues = z.infer<typeof doctorProfileSchema>;
