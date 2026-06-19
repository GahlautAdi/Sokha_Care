import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const doctorAvailabilitySchema = z
  .object({
    dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
    startTime: z.string().trim().min(1, 'Start time is required').regex(timeRegex, 'Enter a valid start time'),
    endTime: z.string().trim().min(1, 'End time is required').regex(timeRegex, 'Enter a valid end time'),
    consultationMode: z.enum(['ONLINE', 'OFFLINE', 'BOTH']),
  })
  .refine((values) => values.endTime > values.startTime, {
    message: 'End time must be greater than start time',
    path: ['endTime'],
  });

export type DoctorAvailabilityFormValues = z.infer<typeof doctorAvailabilitySchema>;
