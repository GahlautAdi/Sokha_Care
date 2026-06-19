export type DoctorVerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export type DoctorVerification = {
  id: string;
  doctorId: string;
  licenseNumber: string;
  medicalCouncil: string;
  documentUrl: string;
  status: DoctorVerificationStatus;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  remarks: string | null;
};

export type DoctorVerificationStatusResponse = {
  doctorId: string;
  doctorProfileExists: boolean;
  canSubmit: boolean;
  latestVerification: DoctorVerification | null;
};

export type DoctorVerificationSubmitValues = {
  licenseNumber: string;
  medicalCouncil: string;
  documentUrl: string;
};

export type DoctorVerificationReviewValues = {
  remarks: string;
};
