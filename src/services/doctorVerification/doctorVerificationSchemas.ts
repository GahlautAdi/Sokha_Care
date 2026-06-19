import { z } from 'zod';

export const doctorVerificationSubmitSchema = z.object({
  licenseNumber: z.string().trim().min(1, 'License number is required').max(100, 'License number is too long'),
  medicalCouncil: z.string().trim().min(1, 'Medical council is required').max(120, 'Medical council is too long'),
  documentUrl: z.string().trim().min(1, 'Document URL is required').url('Enter a valid document URL').max(500, 'Document URL is too long'),
});

export const doctorVerificationReviewSchema = z.object({
  remarks: z.string().trim().max(1000, 'Remarks are too long').optional().or(z.literal('')),
});

export type DoctorVerificationSubmitFormValues = z.infer<typeof doctorVerificationSubmitSchema>;
export type DoctorVerificationReviewFormValues = z.infer<typeof doctorVerificationReviewSchema>;
